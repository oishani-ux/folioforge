import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import publicRoutes from './routes/public.js';
import aiRoutes from './routes/ai.js';
import githubRoutes from './routes/github.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'client', 'dist'); // the built React app (exists after `vite build`)

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy; needed for correct IPs in rate limiting
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/github', githubRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' })); // unknown API route
app.use('/u', publicRoutes);

// Production: serve the built React app. Locally (no build) you use the Vite dev server on :5173 instead.
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('/{*splat}', (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

// Last resort: any error in a route ends up here as clean JSON instead of a crash page.
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: status === 500 ? 'Something went wrong on our side.' : 'Invalid request.' });
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});