"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingTags = void 0;
const db_1 = __importDefault(require("../db"));
const getTrendingTags = (_req, res) => {
    const rows = db_1.default.prepare(`
    SELECT t.name, COUNT(*) as count
    FROM article_tags at
    JOIN tags t ON t.id = at.tag_id
    GROUP BY t.name
    ORDER BY count DESC
    LIMIT 10
  `).all();
    res.json(rows);
};
exports.getTrendingTags = getTrendingTags;
