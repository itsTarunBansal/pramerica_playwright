import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject, NVEST_TENANT_ID } from "../context/ProjectContext";
import { updateProject } from "../services/api";

export default function ProjectPage() {
  const navigate = useNavigate();
  const { projectUrl, setProjectUrl, setActiveProject } = useProject();
  const [editUrl, setEditUrl] = useState(projectUrl);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = editUrl.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await updateProject(NVEST_TENANT_ID, { url: trimmed });
      setProjectUrl(trimmed);
      setActiveProject("nvest", NVEST_TENANT_ID, trimmed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // URL still saved locally even if API fails (Nvest tenant may not exist in DB yet)
      setProjectUrl(trimmed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="project-detail">
      <button className="back-btn" onClick={() => navigate("/projects")}>← Back to Projects</button>

      <div className="project-detail-header">
        <div className="project-avatar large">N</div>
        <div>
          <h1>Nvest</h1>
          <span className="project-badge">Active</span>
        </div>
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
        {saved && <p className="url-saved-msg">✅ URL updated — all test runs will now use this URL.</p>}
      </div>

      <div className="detail-section">
        <h3>Tools</h3>
        <div className="tools-grid">
          <div className="tool-card" onClick={() => navigate("/projects/nvest/generator")}>
            <div className="tool-icon">⚡</div>
            <div>
              <h4>Test Case Generator</h4>
              <p>Create, manage and run test cases for this project.</p>
            </div>
            <span className="lcard-arrow">→</span>
          </div>
          <div className="tool-card" onClick={() => navigate("/projects/nvest/field-manager")}>
            <div className="tool-icon">🎯</div>
            <div>
              <h4>Field Manager</h4>
              <p>Add, edit and reorder dynamic form fields.</p>
            </div>
            <span className="lcard-arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
