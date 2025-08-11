import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import startJobs from './scheduler';
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json());

// Mount API 
app.use('/api', routes);

console.log("Starting initial scrape job");
startJobs();

// Serve frontend static files 
const frontendDistPath = path.join(__dirname, '../../client/build');
app.use(express.static(frontendDistPath));

// SPA catch-all to serve index.html for all non-API routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
