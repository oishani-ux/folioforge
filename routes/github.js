import express from 'express';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Max 20 lookups per IP per minute (GitHub's free limit is low, so we protect it).
router.use(rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));

// Simple in-memory cache: same username within 10 minutes = no new GitHub call.
const cache = new Map();
const TTL = 10 * 60 * 1000;

// GET /api/github/:username -> up to 10 of their latest public repos, shaped like portfolio projects
router.get('/:username', async (req, res) => {
  const username = req.params.username.trim();
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(username)) {
    return res.status(400).json({ error: 'Enter a valid GitHub username.' });
  }

  const key = username.toLowerCase();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return res.json({ projects: hit.projects, cached: true });

  try {
    const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'FolioForge' };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`; // optional, raises the rate limit

    const r = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30&type=owner`,
      { headers },
    );
    if (r.status === 404) return res.status(404).json({ error: 'GitHub user not found.' });
    if (r.status === 403 || r.status === 429) {
      return res.status(429).json({ error: 'GitHub rate limit reached. Please try again in a few minutes.' });
    }
    if (!r.ok) throw new Error(`GitHub responded with ${r.status}`);

    const repos = await r.json();
    const projects = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .slice(0, 10)
      .map((repo) => ({
        id: String(repo.id),
        title: repo.name,
        description: (repo.description || '').slice(0, 500),
        link: repo.html_url,
        language: repo.language || '',
      }));

    cache.set(key, { at: Date.now(), projects });
    res.json({ projects, cached: false });
  } catch (err) {
    console.error('GitHub import error:', err.message);
    res.status(502).json({ error: 'Could not reach GitHub right now. Please try again.' });
  }
});

export default router;
