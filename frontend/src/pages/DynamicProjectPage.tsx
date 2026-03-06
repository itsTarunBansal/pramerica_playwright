import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProject, updateProject, deleteProject, startRecording, stopRecording } from "../services/api";

export default function DynamicProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<{ id: string; name: string; url: string } | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [recordMsg, setRecordMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    getProject(projectId)
      .then(p => { setProject(p); setEditUrl(p.url); })
      .catch(() => navigate("/projects"))
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleSave() {
    if (!project || !editUrl.trim()) return;
    setSaving(true);
    try {
      await updateProject(project.id, { url: editUrl.trim() });
      setProject(prev => prev ? { ...prev, url: editUrl.trim() } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert("Failed to update URL: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!project) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"? This will also delete all recorded fields and cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deleteProject(project.id);
      navigate("/projects");
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    }
  }

  async function handleReRun() {
    if (!project) return;
    const confirmed = window.confirm(
      "⚠️ Warning: Re-running the script will delete all currently recorded fields for this project. You may lose all current flow.\n\nDo you want to continue?"
    );
    if (!confirmed) return;
    setRecording(true);
    setRecordMsg(null);
    try {
      await startRecording(project.id, true);
    } catch (err: any) {
      setRecordMsg(`❌ Failed to start: ${err.message}`);
      setRecording(false);
    }
  }

  async function handleDoneRecording() {
    if (!project) return;
    setStopping(true);
    try {
      const result = await stopRecording(project.id);
      setRecordMsg(`✅ Recording complete. ${result.fieldCount} fields captured.`);
    } catch (err: any) {
      setRecordMsg(`❌ Save failed: ${err.message}`);
    } finally {
      setRecording(false);
      setStopping(false);
    }
  }

  if (loading) return <div className="project-detail"><p>Loading...</p></div>;
  if (!project) return null;

  return (
    <div className="project-detail">
      <button className="back-btn" onClick={() => navigate("/projects")}>← Back to Projects</button>

      <div className="project-detail-header">
        <div className="project-avatar large">{project.name.charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <h1>{project.name}</h1>
          <span className="project-badge">Active</span>
        </div>
        <button
          className="btn-delete"
          onClick={handleDelete}
          style={{ alignSelf: "flex-start", padding: "6px 14px", borderRadius: "8px" }}
        >
          🗑 Delete Project
        </button>
      </div>

      <div className="detail-section">
        <h3>Project URL</h3>
        <p className="detail-hint">This URL is used as the starting point for all Playwright test journeys.</p>
        <div className="url-editor">
          <input
            type="url"
            value={editUrl}
            onChange={e => { setEditUrl(e.target.value); setSaved(false); }}
            placeholder="https://..."
          />
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save URL"}
          </button>
        </div>
        {saved && <p className="url-saved-msg">✅ URL updated.</p>}
      </div>

      <div className="detail-section">
        <h3>Recording</h3>
        <p className="detail-hint">Re-run the Playwright recorder to update the captured journey for this project.</p>
        <button className="btn-secondary" onClick={handleReRun} disabled={recording || stopping}>
          {recording ? "⏳ Browser open — complete journey..." : "🔄 Re-run Script"}
        </button>
        {recording && (
          <>
            <div className="recording-notice" style={{ marginTop: "12px" }}>
              <div className="recording-dot" />
              <p>Playwright browser is open. Complete the full journey, then click <strong>Done Recording</strong>.</p>
            </div>
            <button className="btn-primary" onClick={handleDoneRecording} disabled={stopping}
              style={{ marginTop: "12px" }}>
              {stopping ? "⏳ Saving fields..." : "✅ Done Recording"}
            </button>
          </>
        )}
        {recordMsg && <p style={{ marginTop: "10px", fontSize: "13px" }}>{recordMsg}</p>}
      </div>

      <div className="detail-section">
        <h3>Tools</h3>
        <div className="tools-grid">
          <div className="tool-card" onClick={() => navigate(`/projects/${project.id}/generator`)}>
            <div className="tool-icon">⚡</div>
            <div>
              <h4>Test Case Generator</h4>
              <p>Create, manage and run test cases for {project.name}.</p>
            </div>
            <span className="lcard-arrow">→</span>
          </div>
          <div className="tool-card" onClick={() => navigate(`/projects/${project.id}/field-manager`)}>
            <div className="tool-icon">🎯</div>
            <div>
              <h4>Field Manager</h4>
              <p>Add, edit and reorder dynamic form fields.</p>
            </div>
            <span className="lcard-arrow">→</span>
          </div>
          <div className="tool-card" onClick={() => navigate(`/projects/${project.id}/api-logs`)}>
            <div className="tool-icon">🌐</div>
            <div>
              <h4>API Log Dashboard</h4>
              <p>View API calls, timings and failures from test runs.</p>
            </div>
            <span className="lcard-arrow">→</span>
          </div>
        </div>
      </div>

    </div>
  );
}
