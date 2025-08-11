import express from 'express';
import { getTrendingTags } from '../controllers/tagsController';

const router = express.Router();

router.get('/trending', getTrendingTags);

export default router;