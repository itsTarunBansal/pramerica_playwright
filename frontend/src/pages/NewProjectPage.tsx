import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, startRecording, stopRecording } from "../services/api";

type Step = "setup" | "recording" | "stopping" | "done";

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [urlSaved, setUrlSaved] = useState(false);
  const [step, setStep] = useState<Step>("setup");
  const [project, setProject] = useState<{ id: string; name: string } | null>(null);
  const [fieldCount, setFieldCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSaveUrl() {
    if (!name.trim() || !url.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const created = await createProject({ name: name.trim(), url: url.trim() });
      setProject(created);
      setUrlSaved(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRunScript(clearExisting = false) {
    if (!project) return;
    setError(null);
    try {
      await startRecording(project.id, clearExisting);
      setStep("recording");
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDoneRecording() {
    if (!project) return;
    setStep("stopping");
    setError(null);
    try {
      const result = await stopRecording(project.id);
      setFieldCount(result.fieldCount);
      setStep("done");
    } catch (err: any) {
      setError(err.message);
      setStep("recording");
    }
  }

  async function handleReRun() {
    const confirmed = window.confirm(
      "⚠️ Warning: Re-running the script will delete all currently recorded fields for this project. You may lose all current flow.\n\nDo you want to continue?"
    );
    if (confirmed) await handleRunScript(true);
  }

  return (
    <div className="project-detail">
      <button className="back-btn" onClick={() => navigate("/projects")}>← Back to Projects</button>

      <div className="project-detail-header">
        <div className="project-avatar large">+</div>
        <div>
          <h1>New Project</h1>
          <span className="project-badge" style={{ background: "#e0f2fe", color: "#0369a1" }}>
            {step === "setup" ? "Step 1: Setup"
              : step === "recording" ? "Step 2: Recording..."
              : step === "stopping" ? "Step 2: Saving..."
              : "Step 3: Complete"}
          </span>
        </div>
      </div>

      {/* Step 1: Setup */}
      {step === "setup" && (
        <div className="detail-section">
          <h3>Project Setup</h3>
          <p className="detail-hint">Enter your project name and URL, then save before running the script.</p>
          <div className="new-project-form">
            <div className="form-row">
              <label>Project Name</label>
              <input type="text" value={name}
                onChange={e => { setName(e.target.value); setUrlSaved(false); }}
                placeholder="e.g., MyInsuranceApp" disabled={urlSaved} />
            </div>
            <div className="form-row">
              <label>Project URL</label>
              <input type="url" value={url}
                onChange={e => { setUrl(e.target.value); setUrlSaved(false); }}
                placeholder="https://..." disabled={urlSaved} />
            </div>
            {error && <p className="url-error-msg">❌ {error}</p>}
            <div className="new-project-actions">
              <button className="btn-secondary" onClick={handleSaveUrl}
                disabled={!name.trim() || !url.trim() || saving || urlSaved}>
                {saving ? "Saving..." : urlSaved ? "✓ URL Saved" : "Save URL"}
              </button>
              <button className="btn-primary" onClick={() => handleRunScript(false)} disabled={!urlSaved}>
                ▶ Run Script
              </button>
            </div>
            {urlSaved && (
              <p className="url-saved-msg">✅ Project saved. Click "Run Script" to launch the Playwright recorder.</p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Recording */}
      {(step === "recording" || step === "stopping") && (
        <div className="detail-section">
          <h3>Recording in Progress</h3>
          <div className="recording-notice">
            <div className="recording-dot" />
            <p>Playwright browser is open. Complete the full journey in the browser, then click <strong>Done Recording</strong> below.</p>
          </div>
          {error && <p className="url-error-msg" style={{ marginTop: "10px" }}>❌ {error}</p>}
          <div className="new-project-actions" style={{ marginTop: "16px" }}>
            <button className="btn-primary" onClick={handleDoneRecording} disabled={step === "stopping"}>
              {step === "stopping" ? "⏳ Saving fields..." : "✅ Done Recording"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === "done" && project && (
        <div className="detail-section">
          <div className="done-banner">
            <div className="done-icon">✅</div>
            <div>
              <h3>Recording Complete!</h3>
              <p>{fieldCount} field{fieldCount !== 1 ? "s" : ""} captured and saved for <strong>{project.name}</strong>.</p>
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <button className="btn-secondary" onClick={handleReRun}>🔄 Re-run Script</button>
            <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>
              Re-running will delete all currently recorded fields and start fresh.
            </p>
          </div>
          {error && <p className="url-error-msg" style={{ marginTop: "8px" }}>❌ {error}</p>}
          <div className="tools-grid" style={{ marginTop: "20px" }}>
            <div className="tool-card" onClick={() => navigate(`/projects/${project.id}/generator`)}>
              <div className="tool-icon">⚡</div>
              <div><h4>Test Case Generator</h4><p>Start creating test cases for {project.name}.</p></div>
              <span className="lcard-arrow">→</span>
            </div>
            <div className="tool-card" onClick={() => navigate(`/projects/${project.id}/field-manager`)}>
              <div className="tool-icon">🎯</div>
              <div><h4>Field Manager</h4><p>Review and edit the {fieldCount} captured fields.</p></div>
              <span className="lcard-arrow">→</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
