import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProject, NVEST_TENANT_ID } from "../context/ProjectContext";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchProjects } from "../store/slices/projectsSlice";

const NVEST_URL = "https://nvestuat.pramericalife.in/Life/Login.html";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projectUrl } = useProject();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.projects);
  const dynamicProjects = items.filter((p) => p.id !== NVEST_TENANT_ID);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>My Projects</h1>
        <button className="btn-primary" onClick={() => navigate("/projects/new")}>+ New Project</button>
      </div>

      {error && <p style={{ color: "#ef4444", padding: "8px" }}>{error}</p>}

      <div className="project-grid">
        {/* Nvest — always shown, hardcoded */}
        <div className="project-card" onClick={() => navigate("/projects/nvest")}>
          <div className="project-card-top">
            <div className="project-avatar">N</div>
            <div className="project-meta">
              <h2>Nvest</h2>
              <span className="project-badge">Active</span>
            </div>
          </div>
          <p className="project-url" title={projectUrl}>{projectUrl || NVEST_URL}</p>
          <div className="project-links">
            <span>Test Case Generator</span>
            <span>Field Manager</span>
          </div>
          <span className="lcard-arrow">→</span>
        </div>

        {loading && <div style={{ padding: "20px", color: "#6b7280" }}>Loading projects...</div>}

        {dynamicProjects.map((p) => (
          <div key={p.id} className="project-card" onClick={() => navigate(`/projects/${p.id}`)}>
            <div className="project-card-top">
              <div className="project-avatar">{p.name.charAt(0).toUpperCase()}</div>
              <div className="project-meta">
                <h2>{p.name}</h2>
                <span className="project-badge">Active</span>
              </div>
            </div>
            <p className="project-url" title={p.url}>{p.url}</p>
            <div className="project-links">
              <span>Test Case Generator</span>
              <span>Field Manager</span>
            </div>
            <span className="lcard-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
