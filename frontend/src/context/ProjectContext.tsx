import { createContext, useContext, useState } from "react";

export const NVEST_TENANT_ID = "00000000-0000-0000-0000-000000000001";
const NVEST_URL = "https://nvestuat.pramericalife.in/Life/Login.html";

interface ProjectContextType {
  projectId: string;
  tenantId: string;
  projectUrl: string;
  setActiveProject: (id: string, tenantId: string, url: string) => void;
  setProjectUrl: (url: string) => void;
}

const ProjectContext = createContext<ProjectContextType>({
  projectId: "nvest",
  tenantId: NVEST_TENANT_ID,
  projectUrl: NVEST_URL,
  setActiveProject: () => {},
  setProjectUrl: () => {},
});

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projectId, setProjectId] = useState(() => localStorage.getItem("active_project_id") || "nvest");
  const [tenantId, setTenantId] = useState(NVEST_TENANT_ID);
  const [projectUrl, setProjectUrlState] = useState(
    () => localStorage.getItem("nvest_project_url") || NVEST_URL
  );

  function setActiveProject(id: string, tid: string, url: string) {
    setProjectId(id);
    setTenantId(tid);
    setProjectUrlState(url);
    localStorage.setItem("active_project_id", id);
    localStorage.setItem("nvest_project_url", url);
  }

  function setProjectUrl(url: string) {
    setProjectUrlState(url);
    localStorage.setItem("nvest_project_url", url);
  }

  return (
    <ProjectContext.Provider value={{ projectId, tenantId, projectUrl, setActiveProject, setProjectUrl }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);
