import express from 'express';
import { getArticles, getArticleById } from '../controllers/articlesController';

const router = express.Router();

router.get('/', getArticles);         // /api/articles?search=term&sort=newest
router.get('/:id', getArticleById);   // /api/articles/1

export default router;