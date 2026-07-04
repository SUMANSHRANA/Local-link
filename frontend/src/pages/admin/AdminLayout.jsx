import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RoleSwitcher from "../../components/RoleSwitcher";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { path: "/admin/services", label: "Services", icon: "🔧" },
  { path: "/admin/agents", label: "Service Agents", icon: "👷" },
  { path: "/admin/cities", label: "Cities", icon: "🏙️" },
  { path: "/admin/bookings", label: "Bookings", icon: "📋" },
];

export default function AdminLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="logo">
          <h2>Local Link</h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Admin Panel</p>
        </div>
        <nav>
          <ul>
            {navItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  <span>{item.icon}</span> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, padding: "0 24px" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12 }}>
            👤 {user?.fullName}
          </div>
          <div style={{ marginBottom: 10 }}>
            <RoleSwitcher theme="dark" />
          </div>
          <button
            onClick={handleLogout}
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", width: "100%", fontSize: 13 }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
      <div className="admin-main">
        <div className="admin-header">
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
