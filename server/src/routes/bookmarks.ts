import express from 'express';
import { getBookmarks, addBookmark } from '../controllers/bookmarksController';

const router = express.Router();

router.get('/', getBookmarks);
router.post('/', addBookmark);

export default router;