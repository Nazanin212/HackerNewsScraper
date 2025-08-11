import { Request, Response } from 'express';
import db from '../db';

export const getArticles = (req: Request, res: Response) => {
  const { search, sort, tag } = req.query;
  let sql = `
    SELECT 
      a.id, 
      a.title, 
      substr(a.content, 1, 100) || '...' AS preview, 
      a.author,
      a.points,
      a.created_at
    FROM articles a
    LEFT JOIN article_tags at ON a.id = at.article_id
    LEFT JOIN tags t ON t.id = at.tag_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (search) {
    sql += ` AND a.title LIKE ?`;
    params.push(`%${search}%`);
  }
  if (tag) {
    sql += ` AND t.name = ?`;
    params.push(tag);
  }
  if (sort === 'newest') {
    sql += ` ORDER BY a.created_at DESC`;
  } else if (sort === 'popular') {
    sql += ` ORDER BY (SELECT COUNT(*) FROM comments c WHERE c.article_id = a.id) DESC`;
  }

  const rows = db.prepare(sql).all(...params);
  res.json(rows);
};

export const getArticleById = (req: Request, res: Response) => {
  const id = req.params.id;
  const article = db.prepare(`SELECT * FROM articles WHERE id = ?`).get(id);
  const comments = db.prepare(`SELECT * FROM comments WHERE article_id = ?`).all(id);
  res.json({ article, comments });
};