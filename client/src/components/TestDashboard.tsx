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
  const [tests, setTests] = useState<TestResult[]>([]);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [runningTestId, setRunningTestId] = useState<string | null>(null);

  const fetchTests = () => {
    setIsReloading(true);
    fetch("/tests")
      .then((res) => res.json())
      .then((data) => {
        setTests(data);
        localStorage.setItem("cachedTests", JSON.stringify(data));
      })
      .catch((err) => {
        console.error("Failed to fetch tests:", err);
        setTests([]);
      })
      .finally(() => setIsReloading(false));
  };  

  // Run a single test from the backend
  const runTest = async (testId: string) => {
    setRunningTestId(testId);
    try {
      const res = await fetch(`/tests/run/${testId}`, { method: "POST" });
      const updatedTest = await res.json();

      setTests((prev) =>
        prev.map((t) => (t.id === testId ? updatedTest : t))
      );
    } catch (err) {
      console.error(`Failed to run test ${testId}`, err);
    } finally {
      setRunningTestId(null);
    }
  };

  const toggleExpand = (testId: string) => {
    setExpandedTestId((prev) => (prev === testId ? null : testId));
  };

  useEffect(() => {
    const cachedTests = localStorage.getItem("cachedTests");
    if (cachedTests) {
      setTests(JSON.parse(cachedTests));
    }
  }, []);  

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
