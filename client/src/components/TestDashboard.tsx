import { useState, useEffect } from "react";
import "./TestDashboard.css";

interface TestResult {
  id: string;
  name: string;
  description: string;
  status: "Passed" | "Failed";
  lastRun: string;
  details: string;
}

const TestDashboard = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch("/tests"); 
        if (!res.ok) throw new Error("Failed to fetch test data");
        const data = await res.json();
        setTests(data); // <-- this updates the state
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Test Dashboard</h1>
      </div>

      {loading ? (
        <p>Loading tests...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : tests.length === 0 ? (
        <p>No tests available.</p>
      ) : (
        <div className="test-list">
          {tests && tests.map((test) => (
            <div
              key={test.id}
              className={`test-card ${test.status.toLowerCase()}`}
            >
              <div className="card-header">
                <div className="header-left">{test.name}</div>
              </div>
              <p>
                <strong>Last Run:</strong>{" "}
                {new Date(test.lastRun).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="status">{test.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestDashboard;
