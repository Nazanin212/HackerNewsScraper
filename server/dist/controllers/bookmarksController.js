"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBookmark = exports.getBookmarks = void 0;
const db_1 = __importDefault(require("../db"));
const getBookmarks = (req, res) => {
    const rows = db_1.default.prepare(`
    SELECT a.id, a.title
    FROM bookmarks b
    JOIN articles a ON a.id = b.article_id
  `).all();
    res.json(rows);
};
exports.getBookmarks = getBookmarks;
const addBookmark = (req, res) => {
    const { article_id } = req.body;
    db_1.default.prepare(`INSERT INTO bookmarks (article_id) VALUES (?)`).run(article_id);
    res.status(201).json({ success: true });
};
exports.addBookmark = addBookmark;
