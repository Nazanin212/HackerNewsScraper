import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, 'testResults.db'); 
const db = new Database(dbPath);

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
  db.prepare(`
    INSERT OR REPLACE INTO test_results (id, name, description, status, lastRun, details)
    VALUES (@id, @name, @description, @status, @lastRun, @details)
  `).run(result);
}

export function getCachedTestResults(): TestResult[] {
  return db.prepare('SELECT * FROM test_results').all() as TestResult[];
}

export default db;