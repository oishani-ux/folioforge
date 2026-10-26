// POST /api/ai/design  ->  { spec }
// Turns a short style request into a design spec for the AI template.
// The API key stays on the server (never in the browser).
import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  sanitizeSpec, FONTS, LAYOUTS, HEROES, CARDS, BACKGROUNDS, DENSITIES, SECTIONS,
} from '../client/src/templates/ai.js';

const router = express.Router();

// Max 15 AI requests per user IP every 15 minutes, so nobody can burn our quota.
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 15, standardHeaders: true, legacyHeaders: false }));

const SYSTEM = `You are a senior web designer creating a personal portfolio theme.
Reply with ONLY a JSON object, no markdown, in exactly this shape:
{
  "name": "short theme name, 2-3 words",
  "colors": { "bg": "#RRGGBB", "surface": "#RRGGBB", "text": "#RRGGBB", "muted": "#RRGGBB", "accent": "#RRGGBB" },
  "fonts": { "heading": one of ${JSON.stringify(FONTS)}, "body": one of ${JSON.stringify(FONTS)} },
  "layout": one of ${JSON.stringify(LAYOUTS)},
  "hero": one of ${JSON.stringify(HEROES)},
  "cards": one of ${JSON.stringify(CARDS)},
  "background": one of ${JSON.stringify(BACKGROUNDS)},
  "density": one of ${JSON.stringify(DENSITIES)},
  "radius": integer 0-28,
  "sectionOrder": array using all of ${JSON.stringify(SECTIONS)} in the best order for this person
}
Rules: text must have strong contrast on bg (WCAG AA). surface is a subtle step from bg.
muted is a softer version of text. accent should stand out on bg.
Match the person's field and the requested vibe. Be bold and specific, avoid generic blue themes.`;

router.post('/design', async (req, res) => {
  const { prompt = '', profile = {} } = req.body || {};
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'AI is not configured (missing GEMINI_API_KEY).' });
  if (typeof prompt !== 'string' || prompt.length > 400) return res.status(400).json({ error: 'Describe your style in under 400 characters.' });

  // Only send what's needed to style the page: no email, links or photo.
  const userMsg = `Style request: ${prompt || 'surprise me'}
About the person: tagline "${String(profile.tagline || '').slice(0, 120)}", skills: ${(profile.skills || []).slice(0, 15).join(', ')}, number of projects: ${profile.projectCount || 0}.`;

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: 'user', parts: [{ text: userMsg }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 1 },
      }),
    });
    const json = await r.json();
    if (!r.ok) throw new Error(json.error?.message || `AI request failed (${r.status})`);
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const raw = JSON.parse(text.replace(/^```(json)?|```$/g, '').trim());
    res.json({ spec: sanitizeSpec(raw) }); // never trust AI output: re-check every value
  } catch (err) {
    console.error('AI design error:', err.message);
    res.status(502).json({ error: 'Could not generate a design right now. Please try again.' });
  }
});

export default router;
