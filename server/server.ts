import express from 'express';
import cors from 'cors';
import path from 'path';
import topStoriesRouter from './routes/topStories';
import hackerNewsTests from './routes/hackerNewsTests';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/top-stories', topStoriesRouter);
app.use('/tests', hackerNewsTests);

// Serve React frontend build (for production)
app.use(express.static(path.join(__dirname, '../client/build')));

// React Router fallback route
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});