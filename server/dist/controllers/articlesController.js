"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticleById = exports.getArticles = void 0;
const db_1 = __importDefault(require("../db"));
const getArticles = (req, res) => {
    const { search, sort, tag } = req.query;
    let sql = `
    SELECT a.id, a.title, substr(a.content, 1, 100) || '...' AS preview, a.created_at
    FROM articles a
    LEFT JOIN article_tags at ON a.id = at.article_id
    LEFT JOIN tags t ON t.id = at.tag_id
    WHERE 1=1
  `;
    const params = [];
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
    }
    else if (sort === 'popular') {
        sql += ` ORDER BY (SELECT COUNT(*) FROM comments c WHERE c.article_id = a.id) DESC`;
    }
    const rows = db_1.default.prepare(sql).all(...params);
    res.json(rows);
};
exports.getArticles = getArticles;
const getArticleById = (req, res) => {
    const id = req.params.id;
    const article = db_1.default.prepare(`SELECT * FROM articles WHERE id = ?`).get(id);
    const comments = db_1.default.prepare(`SELECT * FROM comments WHERE article_id = ?`).all(id);
    res.json({ article, comments });
};
exports.getArticleById = getArticleById;
