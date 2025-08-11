import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../data/app.db');
const db = new Database(dbPath);
console.log("[DB] Connected to db: ")

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    author TEXT,
    points INTEGER,
    content TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY,
    article_id INTEGER,
    text TEXT NOT NULL,
    author TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(article_id) REFERENCES articles(id)
  );
  
  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY,
    article_id INTEGER,
    FOREIGN KEY(article_id) REFERENCES articles(id)
  );
  
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE
  );
  
  CREATE TABLE IF NOT EXISTS article_tags (
    article_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY(article_id) REFERENCES articles(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
  );
  `);

export default db;
