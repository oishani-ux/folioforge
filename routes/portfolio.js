import express from 'express';
import { z } from 'zod';
import Portfolio from '../models/Portfolio.js';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
router.use(requireAuth); // every route below needs a logged-in user

const str = (max) => z.string().max(max).default('');

// Matches the shape of the frontend store: { data, theme }
const saveSchema = z.object({
  data: z.object({
    name: str(100),
    tagline: str(200),
    about: str(2000),
    photo: str(1_500_000), // base64 image, already shrunk by the frontend
    skills: z.array(z.string().max(50)).max(30).default([]),
    projects: z
      .array(z.object({ id: z.string().max(60).optional(), title: str(100), description: str(500), link: str(300) }))
      .max(20)
      .default([]),
    socials: z
      .object({ github: str(200), linkedin: str(200), email: str(200), website: str(200) })
      .optional(),
  }),
  theme: z
    .object({
      template: z.string().max(20).default('minimal'),
      color: z.string().max(9).default('#ff5a1f'),
      font: z.string().max(40).default('Inter'),
      ai: z.any().optional(), // AI design spec; cleaned again by the template when rendering
    })
    .optional(),
});

// GET /api/portfolio -> my saved portfolio (or null if none yet)
router.get('/', async (req, res) => {
  const p = await Portfolio.findOne({ user: req.userId });
  res.json({ portfolio: p ? { data: p.data, theme: p.theme, published: p.published, views: p.views } : null });
});

// PUT /api/portfolio -> create or update my portfolio
router.put('/', async (req, res) => {
  const parsed = saveSchema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const p = await Portfolio.findOneAndUpdate(
    { user: req.userId },
    { data: parsed.data.data, theme: parsed.data.theme ?? {} },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );
  res.json({ ok: true, published: p.published });
});

// POST /api/portfolio/publish and /unpublish
async function setPublished(req, res, value) {
  const p = await Portfolio.findOneAndUpdate({ user: req.userId }, { published: value }, { returnDocument: 'after' });
  if (!p) return res.status(400).json({ error: 'Save your portfolio before publishing.' });
  const user = await User.findById(req.userId);
  res.json({ ok: true, published: p.published, url: `/u/${user.username}` });
}
router.post('/publish', (req, res) => setPublished(req, res, true));
router.post('/unpublish', (req, res) => setPublished(req, res, false));

export default router;
