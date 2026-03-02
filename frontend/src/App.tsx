import { Link, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TestBuilderPage from "./pages/TestBuilderPage";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">AI Insurance Test Copilot</div>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/builder">No-Code Test Builder</Link>
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/builder" element={<TestBuilderPage />} />
        </Routes>
      </main>
    </div>
  );
}

