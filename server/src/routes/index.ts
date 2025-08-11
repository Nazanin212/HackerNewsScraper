import express from 'express';
import articles from './articles';
import bookmarks from './bookmarks';
import tags from './tags';

const router = express.Router();

router.get('/', (_req, res) => {
    res.json({ message: 'Hacker News API is running 🚀' });
});

router.use('/articles', articles);
router.use('/bookmarks', bookmarks);
router.use('/tags', tags);

export default router;