import express from 'express';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
// The SAME render function the live preview uses, so published pages match the preview exactly.
import { renderPortfolio } from '../client/src/templates/index.js';

const router = express.Router();

const notFound = (res) =>
  res.status(404).send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Not found · FolioForge</title>
<body style="font-family:system-ui;display:grid;place-items:center;min-height:100vh;margin:0;background:#09090b;color:#fafafa;text-align:center">
<div><h1>404</h1><p>This portfolio doesn't exist or isn't published yet.</p><a href="/" style="color:#ff5a1f">Build yours with FolioForge</a></div></body>`);

// GET /u/:username -> the public portfolio page, and count the view
router.get('/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!user) return notFound(res);

  const p = await Portfolio.findOneAndUpdate(
    { user: user._id, published: true },
    { $inc: { views: 1 } },
    { returnDocument: 'after' },
  );
  if (!p) return notFound(res);

  res.type('html').send(renderPortfolio(p.data, p.theme));
});

export default router;
