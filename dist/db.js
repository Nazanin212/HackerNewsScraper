"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.getDB = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
async function getDB() {
    return (0, sqlite_1.open)({
        filename: './scraper.db',
        driver: sqlite3_1.default.Database,
    });
}
exports.getDB = getDB;
async function initDB() {
    const db = await getDB();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT,
      url TEXT,
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
exports.initDB = initDB;
