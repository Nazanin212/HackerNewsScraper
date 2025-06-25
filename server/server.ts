import express from 'express';

/*
Routes
- Validate first 100 (Can have option to pick new or next?)
- Keyword Search
- Top 5 Stories Viewer

- Test results
- History viewer (Later)
*/

const app = express();
const PORT = 4000;

// Basic route
app.get('/', (_req, res) => {
  res.send('Welcome to my shitty website');
});

// Start the server
const port = parseInt(process.env.PORT || '3000', 10);
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});