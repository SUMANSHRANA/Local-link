import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  {
    key: "customer",
    label: "Customer",
    icon: "🛍️",
    loginPath: "/login",
    description: "Browse & book services",
  },
  {
    key: "serviceAgent",
    label: "Service Provider",
    icon: "👷",
    loginPath: "/agent/login",
    description: "Manage your bookings",
  },
  {
    key: "admin",
    label: "Admin",
    icon: "🔐",
    loginPath: "/admin",
    description: "Manage the platform",
  },
];

/**
 * RoleSwitcher — lets any logged-in user jump to a different portal.
 *
 * Props:
 *   theme: "light" (default, for customer navbar) | "dark" (for admin sidebar / SA navbar)
 *   compact: true → just show an icon button (good for tight layouts)
 */
export default function RoleSwitcher({ theme = "light", compact = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentRole = ROLES.find((r) => r.key === user?.role);
  const otherRoles = ROLES.filter((r) => r.key !== user?.role);

  const handleSwitch = (role) => {
    setOpen(false);
    logout();
    navigate(role.loginPath);
  };

  const isDark = theme === "dark";

  const btnStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: isDark ? "rgba(255,255,255,0.08)" : "#f0f0ff",
    border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1.5px solid #d0d0ff",
    borderRadius: 20,
    padding: compact ? "6px 10px" : "7px 14px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    color: isDark ? "rgba(255,255,255,0.85)" : "#444",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
  };

  const menuStyle = {
    position: "absolute",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    minWidth: 210,
    zIndex: 9999,
    overflow: "hidden",
    border: "1px solid #ececff",
    // position below or above depending on space – default below-right
    bottom: isDark ? "100%" : undefined,
    top: isDark ? undefined : "calc(100% + 6px)",
    right: 0,
    marginBottom: isDark ? 8 : undefined,
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button style={btnStyle} onClick={() => setOpen((o) => !o)} title="Switch portal">
        <span style={{ fontSize: 15 }}>🔄</span>
        {!compact && <span>Switch Role</span>}
        <span style={{ fontSize: 9, opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={menuStyle}>
          {/* Current role badge */}
          <div
            style={{
              padding: "10px 16px 8px",
              background: "#f7f7ff",
              borderBottom: "1px solid #ececff",
              fontSize: 11,
              color: "#999",
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Currently: {currentRole?.icon} {currentRole?.label}
          </div>

          <div style={{ padding: "6px 0" }}>
            <div
              style={{
                padding: "4px 16px 6px",
                fontSize: 11,
                color: "#bbb",
                fontWeight: 600,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              Switch to
            </div>
            {otherRoles.map((role) => (
              <button
                key={role.key}
                onClick={() => handleSwitch(role)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0ff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <span style={{ fontSize: 20 }}>{role.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>
                    {role.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>{role.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #f0f0f0", padding: "8px 16px" }}>
            <button
              onClick={() => {
                setOpen(false);
                logout();
                navigate("/");
              }}
              style={{
                width: "100%",
                padding: "8px 0",
                background: "none",
                border: "none",
                color: "#e53935",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              🚪 Sign Out Completely
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
