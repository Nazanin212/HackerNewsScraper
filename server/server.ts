import express from 'express';

/*
Routes
- Validate first 100 (Can have option to pick new or next?)
- 
- Scheduled scrape of article titles
- Top Stories Viewer
- Keyword Tracker
*/

const app = express();
const PORT = 4000;

// Basic route
app.get('/', (_req, res) => {
  res.send('✅ Test test test test test!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});