import { Request, Response } from 'express';
import db from '../db';

export const getTrendingTags = (_req: Request, res: Response) => {
  const rows = db.prepare(`
    SELECT t.name, COUNT(*) as count
    FROM article_tags at
    JOIN tags t ON t.id = at.tag_id
    GROUP BY t.name
    ORDER BY count DESC
    LIMIT 10
  `).all();
  res.json(rows);
};