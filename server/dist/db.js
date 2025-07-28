"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTestResult = saveTestResult;
exports.getCachedTestResults = getCachedTestResults;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, 'testResults.db');
const db = new better_sqlite3_1.default(dbPath);
console.info('[DB] Connected to SQLite database at:', dbPath);
// Create table if needed
db.prepare(`
  CREATE TABLE IF NOT EXISTS test_results (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT,
    lastRun TEXT,
    details TEXT
  )
`).run();
function saveTestResult(result) {
    console.log(`[DB] Saving ${result} to cache ...`);
    db.prepare(`
    INSERT OR REPLACE INTO test_results (id, name, description, status, lastRun, details)
    VALUES (@id, @name, @description, @status, @lastRun, @details)
  `).run(result);
    db.prepare(`
    DELETE FROM test_results
    WHERE id NOT IN (
      SELECT id FROM test_results
      ORDER BY datetime(lastRun) DESC
      LIMIT 5
    )
  `).run();
    console.log(`[DB] Cached!`);
}
function getCachedTestResults() {
    console.log(`[DB] Retrieving cached results ...`);
    return db.prepare('SELECT * FROM test_results').all();
}
exports.default = db;
