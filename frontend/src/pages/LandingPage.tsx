import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="landing-badge">AI-Powered</div>
        <h1 className="landing-title">Insurance Test Copilot</h1>
        <p className="landing-sub">Automate, manage and run insurance journey tests with zero friction.</p>
      </div>

      <div className="landing-cards">
        <div className="landing-card" onClick={() => navigate("/projects")}>
          <div className="lcard-icon">📁</div>
          <h2>My Projects</h2>
          <p>View and manage your existing test projects and configurations.</p>
          <span className="lcard-arrow">→</span>
        </div>

        <div className="landing-card landing-card--primary" onClick={() => navigate("/projects/new")}>
          <div className="lcard-icon">✦</div>
          <h2>New Project</h2>
          <p>Register a new application URL and set up a test workspace.</p>
          <span className="lcard-arrow">→</span>
        </div>

        <div className="landing-card" onClick={() => navigate("/generator")}>
          <div className="lcard-icon">⚡</div>
          <h2>Test Case Generator</h2>
          <p>Jump directly into generating and running test cases.</p>
          <span className="lcard-arrow">→</span>
        </div>
      </div>
    </div>
  );
}
