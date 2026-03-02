import { useEffect, useState } from "react";
import { getHealth, listTestCases } from "../services/api";

export default function DashboardPage() {
  const [health, setHealth] = useState("checking...");
  const [testCases, setTestCases] = useState<Array<{ id: string; name: string; appUrl: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const status = await getHealth();
        setHealth(status.status);
        const rows = await listTestCases();
        setTestCases(rows);
      } catch (err: any) {
        setError(err.message ?? "Failed to load dashboard");
      }
    }
    load();
  }, []);

  return (
    <section className="panel-grid">
      <article className="panel">
        <h2>Platform Status</h2>
        <p>
          API Health: <strong>{health}</strong>
        </p>
        {error ? <p className="error">{error}</p> : null}
      </article>

      <article className="panel">
        <h2>Recent Test Cases</h2>
        {testCases.length === 0 ? (
          <p>No test cases yet. Go to No-Code Test Builder to create one.</p>
        ) : (
          <ul className="simple-list">
            {testCases.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <small>{item.appUrl}</small>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}

