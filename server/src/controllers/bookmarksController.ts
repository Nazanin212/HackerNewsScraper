import { Request, Response } from 'express';
import db from '../db';

export const getBookmarks = (req: Request, res: Response) => {
  const rows = db.prepare(`
    SELECT a.id, a.title
    FROM bookmarks b
    JOIN articles a ON a.id = b.article_id
  `).all();
  res.json(rows);
};

export const addBookmark = (req: Request, res: Response) => {
  const { article_id } = req.body;
  db.prepare(`INSERT INTO bookmarks (article_id) VALUES (?)`).run(article_id);
  res.status(201).json({ success: true });
};
