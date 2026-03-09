import { useNavigate } from "react-router-dom";
import { getSession, clearSession } from "../auth/authService";

// ── Placeholder sections – wire up real logic when backend is ready ──
const ADMIN_SECTIONS = [
  {
    icon: "👤",
    title: "User Management",
    description: "Create, edit, and deactivate user accounts.",
    action: "Manage Users",
  },
  {
    icon: "🔑",
    title: "Access Control",
    description: "Assign roles and manage user permissions.",
    action: "Manage Access",
  },
  {
    icon: "🏢",
    title: "Active Directory",
    description: "Configure AD/LDAP integration for SSO.",
    action: "Configure AD",
  },
  {
    icon: "📋",
    title: "Audit Logs",
    description: "View login history and system activity.",
    action: "View Logs",
  },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const user = getSession();

  function handleLogout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-left">
          <span className="login-brand-icon" style={{ fontSize: 20 }}>✦</span>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Kryptonite</span>
          <span className="admin-badge">Admin Panel</span>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">👤 {user?.username}</span>
          <button className="btn-secondary" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="admin-body">
        <h2 className="admin-section-title">Administration</h2>
        <p className="admin-section-sub">
          Manage users, permissions, and system configuration.
        </p>

        <div className="admin-grid">
          {ADMIN_SECTIONS.map((s) => (
            <div className="admin-card" key={s.title}>
              <div className="admin-card-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <button
                className="btn-primary"
                style={{ marginTop: "auto", fontSize: 13 }}
                onClick={() => alert("Coming soon – " + s.title)}
              >
                {s.action}
              </button>
            </div>
          ))}
        </div>

        <div className="admin-notice">
          🚧 Full admin functionality will be available after backend integration.
        </div>
      </div>
    </div>
  );
}
