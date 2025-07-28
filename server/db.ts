import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, 'testResults.db'); 
const db = new Database(dbPath);
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

export interface TestResult {
  id: string;
  name: string;
  description: string;
  status: 'Passed' | 'Failed';
  lastRun: string;
  details?: string;
}

export function saveTestResult(result: TestResult) {
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

export function getCachedTestResults(): TestResult[] {
  console.log(`[DB] Retrieving cached results ...`);
  return db.prepare('SELECT * FROM test_results').all() as TestResult[];
}

export default db;