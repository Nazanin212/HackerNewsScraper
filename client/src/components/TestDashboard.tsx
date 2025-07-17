import React, { useEffect, useState } from "react";
import "./TestDashboard.css";

interface TestResult {
  id: string;
  name: string;
  description: string;
  status: "Passed" | "Failed";
  lastRun: string;
  errorOutput?: string;
}

const TestDashboard = () => {
  const [tests, _setTests] = useState<TestResult[]>([]);
  const [expandedTestId, _setExpandedTestId] = useState<string | null>(null);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Test Dashboard</h1>
        {/*<button
          className={`reload-btn ${isReloading ? "loading" : ""}`}
          onClick={fetchTests}
        >
          {isReloading ? <span className="spinner" /> : "🔄 Reload Tests"}
        </button>*/}
      </div>

      <div className="test-list">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`test-card ${test.status.toLowerCase()}`}
          >
            <div className="card-header">
              <div className="header-left">{test.name}</div>
            </div>

            {/*<p className="description">{test.description}</p>*/}
            <p>
              <strong>Last Run:</strong>{" "}
              {new Date(test.lastRun).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="status">{test.status}</span>
            </p>

            {expandedTestId === test.id && test.errorOutput && (
              <div className="stream-output">
                <pre className="live-log">{test.errorOutput}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestDashboard;
