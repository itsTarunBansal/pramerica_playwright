import { Link, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TestBuilderPage from "./pages/TestBuilderPage";
import PramericaTestPage from "./pages/PramericaTestPage";
import TestCaseGeneratorPage from "./pages/TestCaseGeneratorPage";
import FieldManagerPage from "./pages/FieldManagerPage";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">AI Insurance Test Copilot</div>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/builder">No-Code Test Builder</Link>
          <Link to="/pramerica">Pramerica Test</Link>
          <Link to="/generator">Test Case Generator</Link>
          <Link to="/field-manager">Field Manager</Link>
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/builder" element={<TestBuilderPage />} />
          <Route path="/pramerica" element={<PramericaTestPage />} />
          <Route path="/generator" element={<TestCaseGeneratorPage />} />
          <Route path="/field-manager" element={<FieldManagerPage />} />
        </Routes>
      </main>
    </div>
  );
}

