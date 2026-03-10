import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchApiLogs, deleteProjectLogs, deleteLogRun } from "../store/slices/apiLogsSlice";

const NVEST_TENANT_ID = "00000000-0000-0000-0000-000000000001";

type ApiLogEntry = {
  _id: string; testCaseId: string; pageUrl: string; apiEndpoint: string;
  method: string; statusCode: any; startTime: string; endTime: string;
  responseTime: number; requestPayload?: string; responseBody?: string;
};
type TestCaseGroup = { testCaseId: string; logs: ApiLogEntry[] };
type RunGroup = { runId: string; testCases: TestCaseGroup[] };

function isFail(code: any) { return code === "FAILED" || (typeof code === "number" && code >= 400); }

function RunStats({ logs }: { logs: ApiLogEntry[] }) {
  const total = logs.length;
  const failed = logs.filter(l => isFail(l.statusCode)).length;
  const avg = total ? Math.round(logs.reduce((s, l) => s + l.responseTime, 0) / total) : 0;
  return (
    <div className="api-stats">
      <span className="api-stat"><strong>{total}</strong> calls</span>
      <span className="api-stat ok"><strong>{total - failed}</strong> ok</span>
      {failed > 0 && <span className="api-stat fail"><strong>{failed}</strong> failed</span>}
      <span className="api-stat">avg <strong>{avg}ms</strong></span>
    </div>
  );
}

function LogRow({ log }: { log: ApiLogEntry }) {
  const [open, setOpen] = useState(false);
  const hasDetail = !!(log.requestPayload || log.responseBody);
  return (
    <>
      <tr className={isFail(log.statusCode) ? "api-row-fail" : ""}
        style={{ cursor: hasDetail ? "pointer" : "default" }}
        onClick={() => hasDetail && setOpen(o => !o)}>
        <td className="api-endpoint" title={log.apiEndpoint}>
          {hasDetail && <span style={{ marginRight: 5, fontSize: 10 }}>{open ? "▼" : "▶"}</span>}
          {log.apiEndpoint}
        </td>
        <td><span className={`api-method api-method-${log.method?.toLowerCase()}`}>{log.method}</span></td>
        <td><span className={isFail(log.statusCode) ? "api-status-fail" : "api-status-ok"}>{log.statusCode}</span></td>
        <td>{log.responseTime}ms</td>
        <td className="api-endpoint" title={log.pageUrl}>{log.pageUrl}</td>
        <td style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap" }}>{new Date(log.startTime).toLocaleTimeString()}</td>
      </tr>
      {open && hasDetail && (
        <tr><td colSpan={6} style={{ background: "#f8fefe", padding: "10px 14px" }}>
          {log.requestPayload && <div style={{ marginBottom: log.responseBody ? 8 : 0 }}>
            <strong style={{ fontSize: 11, color: "var(--muted)" }}>REQUEST PAYLOAD</strong>
            <pre style={{ margin: "4px 0 0", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{log.requestPayload}</pre>
          </div>}
          {log.responseBody && <div>
            <strong style={{ fontSize: 11, color: "var(--muted)" }}>RESPONSE BODY</strong>
            <pre style={{ margin: "4px 0 0", fontSize: 11, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{log.responseBody}</pre>
          </div>}
        </td></tr>
      )}
    </>
  );
}

function LogTable({ logs }: { logs: ApiLogEntry[] }) {
  return (
    <div className="api-table-wrap">
      <table className="api-table">
        <thead>
          <tr>
            <th>API Endpoint</th><th>Method</th><th>Status</th>
            <th>Response Time</th><th>Page URL</th><th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => <LogRow key={i} log={log} />)}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiLogDashboard() {
  const { projectId: rawId } = useParams<{ projectId: string }>();
  const isNvest = rawId === "nvest" || rawId === NVEST_TENANT_ID;
  const projectId = isNvest ? NVEST_TENANT_ID : rawId!;
  const backPath = isNvest ? "/projects/nvest" : `/projects/${rawId}`;
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { logs: runs, loading, error } = useAppSelector((s) => s.apiLogs);

  const [expandedRuns, setExpandedRuns] = useState<Set<string>>(new Set());
  const [expandedTcs, setExpandedTcs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (projectId) dispatch(fetchApiLogs(projectId));
  }, [projectId, dispatch]);

  async function handleDeleteAll() {
    if (!projectId || !window.confirm("Delete all API logs for this project?")) return;
    dispatch(deleteProjectLogs(projectId));
  }

  async function handleDeleteRun(runId: string) {
    if (!projectId || !window.confirm("Delete this run's logs?")) return;
    dispatch(deleteLogRun({ projectId, runId }));
  }

  function toggleRun(runId: string) {
    setExpandedRuns(prev => { const n = new Set(prev); n.has(runId) ? n.delete(runId) : n.add(runId); return n; });
  }

  function toggleTc(key: string) {
    setExpandedTcs(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }

  const allLogs = (runs as RunGroup[]).flatMap(r => r.testCases?.flatMap(tc => tc.logs) ?? []);
  const totalFailed = allLogs.filter(l => isFail(l.statusCode)).length;
  const overallAvg = allLogs.length ? Math.round(allLogs.reduce((s, l) => s + l.responseTime, 0) / allLogs.length) : 0;

  return (
    <div className="project-detail">
      <button className="back-btn" onClick={() => navigate(backPath)}>← Back to Project</button>

      <div className="project-detail-header">
        <div>
          <h1>🌐 API Log Dashboard</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
            All API calls captured during test runs — grouped by run and test case
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-secondary" onClick={() => dispatch(fetchApiLogs(projectId))} disabled={loading}>
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
          {runs.length > 0 && (
            <button className="btn-secondary" onClick={handleDeleteAll}
              style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
              🗑 Delete All Logs
            </button>
          )}
        </div>
      </div>

      {allLogs.length > 0 && (
        <div className="detail-section" style={{ marginBottom: 20 }}>
          <h3>Overall Summary</h3>
          <div className="api-stats" style={{ marginTop: 10 }}>
            <span className="api-stat"><strong>{runs.length}</strong> runs</span>
            <span className="api-stat"><strong>{allLogs.length}</strong> total calls</span>
            <span className="api-stat ok"><strong>{allLogs.length - totalFailed}</strong> passed</span>
            {totalFailed > 0 && <span className="api-stat fail"><strong>{totalFailed}</strong> failed</span>}
            <span className="api-stat">avg <strong>{overallAvg}ms</strong></span>
          </div>
        </div>
      )}

      {loading && <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading logs...</p>}

      {error && (
        <div className="detail-section" style={{ borderColor: "var(--danger)" }}>
          <p style={{ color: "var(--danger)", fontSize: 14, margin: 0 }}>❌ Error: {error}</p>
        </div>
      )}

      {!loading && !error && runs.length === 0 && (
        <div className="detail-section">
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            No API logs yet. Run test cases from the Test Case Generator to see logs here.
          </p>
        </div>
      )}

      {(runs as RunGroup[]).map(run => {
        const runLogs = run.testCases?.flatMap(tc => tc.logs) ?? [];
        const runOpen = expandedRuns.has(run.runId);
        const runDate = new Date(run.runId).toLocaleString();
        return (
          <div key={run.runId} className="detail-section" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
              onClick={() => toggleRun(run.runId)}>
              <div>
                <h3 style={{ margin: 0 }}>{runOpen ? "▼" : "▶"} Run — {runDate}</h3>
                <div style={{ marginTop: 6 }}><RunStats logs={runLogs} /></div>
              </div>
              <button className="btn-secondary"
                style={{ color: "var(--danger)", borderColor: "var(--danger)", fontSize: 12, padding: "4px 12px" }}
                onClick={e => { e.stopPropagation(); handleDeleteRun(run.runId); }}>
                🗑 Delete Run
              </button>
            </div>

            {runOpen && run.testCases?.map(tc => {
              const tcKey = `${run.runId}-${tc.testCaseId}`;
              const tcOpen = expandedTcs.has(tcKey);
              const tcFailed = tc.logs.filter(l => isFail(l.statusCode)).length;
              return (
                <div key={tcKey} style={{ marginTop: 14, borderTop: "1px solid #eef4f5", paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: tcOpen ? 10 : 0 }}
                    onClick={() => toggleTc(tcKey)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{tcOpen ? "▼" : "▶"} Test Case #{tc.testCaseId}</span>
                      <span className="api-stat" style={{ fontSize: 11 }}>{tc.logs.length} calls</span>
                      {tcFailed > 0 && <span className="api-stat fail" style={{ fontSize: 11 }}>{tcFailed} failed</span>}
                    </div>
                  </div>
                  {tcOpen && <LogTable logs={tc.logs} />}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
