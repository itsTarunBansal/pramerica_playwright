import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProjectProvider, useProject, NVEST_TENANT_ID } from "./context/ProjectContext";
import { getProject } from "./services/api";
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
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-dot">◆</span> Test Copilot
      </Link>
      <nav>
        <Link to="/projects" className={loc.pathname.startsWith("/projects") ? "nav-active" : ""}>Projects</Link>
        <Link to="/generator" className={loc.pathname === "/generator" ? "nav-active" : ""}>Generator</Link>
        <Link to="/field-manager" className={loc.pathname === "/field-manager" ? "nav-active" : ""}>Field Manager</Link>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <div className="app-shell">
        <NavBar />
        <main className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/new" element={<NewProjectPage />} />
            <Route path="/projects/nvest" element={<ProjectPage />} />
            {/* Dynamic project routes */}
            <Route path="/projects/:projectId" element={<DynamicProjectPage />} />
            <Route path="/projects/:projectId/generator" element={<ProjectToolWrapper tool="generator" />} />
            <Route path="/projects/:projectId/field-manager" element={<ProjectToolWrapper tool="field-manager" />} />
            {/* Legacy routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/builder" element={<TestBuilderPage />} />
            <Route path="/pramerica" element={<PramericaTestPage />} />
            <Route path="/generator" element={<TestCaseGeneratorPage />} />
            <Route path="/field-manager" element={<FieldManagerPage />} />
          </Routes>
        </main>
      </div>
    </ProjectProvider>
  );
}
