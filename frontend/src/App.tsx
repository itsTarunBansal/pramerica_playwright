import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProjectProvider, useProject, NVEST_TENANT_ID } from "./context/ProjectContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { getProject } from "./services/api";
import { clearSession, getSession } from "./auth/authService";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import DynamicProjectPage from "./pages/DynamicProjectPage";
import NewProjectPage from "./pages/NewProjectPage";
import DashboardPage from "./pages/DashboardPage";
import TestBuilderPage from "./pages/TestBuilderPage";
import PramericaTestPage from "./pages/PramericaTestPage";
import TestCaseGeneratorPage from "./pages/TestCaseGeneratorPage";
import FieldManagerPage from "./pages/FieldManagerPage";
import ApiLogDashboard from "./pages/ApiLogDashboard";

// Wrapper: loads project by id from URL param and renders tool
function ProjectToolWrapper({ tool }: { tool: "generator" | "field-manager" }) {
  const { projectId } = useParams<{ projectId: string }>();
  const { projectUrl: nvestUrl } = useProject();
  const isNvest = projectId === "nvest";
  const [project, setProject] = useState<{ url: string; name: string } | undefined>(
    isNvest ? { url: nvestUrl, name: "Nvest" } : undefined
  );

  useEffect(() => {
    if (!isNvest && projectId)
      getProject(projectId).then(p => setProject({ url: p.url, name: p.name })).catch(() => {});
  }, [projectId]);

  const tenantId = isNvest ? NVEST_TENANT_ID : projectId;
  if (tool === "generator") return <TestCaseGeneratorPage tenantId={tenantId} projectUrl={project?.url} projectName={project?.name} />;
  return <FieldManagerPage tenantId={tenantId} />;
}

function NavBar() {
  const loc = useLocation();
  const navigate = useNavigate();
  const user = getSession();

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  const { theme, toggle } = useTheme();

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-dot" style={{color:"#39ff14"}}>◆</span> Kryptonite
      </Link>
      <nav>
        <Link to="/projects" className={loc.pathname.startsWith("/projects") ? "nav-active" : ""}>Projects</Link>
        <Link to="/generator" className={loc.pathname === "/generator" ? "nav-active" : ""}>Generator</Link>
        <Link to="/field-manager" className={loc.pathname === "/field-manager" ? "nav-active" : ""}>Field Manager</Link>
        {user?.role === "admin" && (
          <Link to="/admin" className={loc.pathname === "/admin" ? "nav-active" : ""}>Admin</Link>
        )}
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="theme-toggle" onClick={toggle} title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {user && (
          <button className="topbar-logout" onClick={handleLogout}>Sign Out</button>
        )}
      </div>
    </header>
  );
}

export default function App() {
  return (
    <ThemeProvider>
    <ProjectProvider>
      <div className="app-shell">
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected – all other routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <NavBar />
                <main className="content">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/new" element={<NewProjectPage />} />
                    <Route path="/projects/:projectId/generator" element={<ProjectToolWrapper tool="generator" />} />
                    <Route path="/projects/:projectId/field-manager" element={<ProjectToolWrapper tool="field-manager" />} />
                    <Route path="/projects/:projectId/api-logs" element={<ApiLogDashboard />} />
                    <Route path="/projects/nvest" element={<ProjectPage />} />
                    <Route path="/projects/:projectId" element={<DynamicProjectPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/builder" element={<TestBuilderPage />} />
                    <Route path="/pramerica" element={<PramericaTestPage />} />
                    <Route path="/generator" element={<TestCaseGeneratorPage />} />
                    <Route path="/field-manager" element={<FieldManagerPage />} />
                  </Routes>
                </main>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ProjectProvider>
    </ThemeProvider>
  );
}
