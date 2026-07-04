import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleSwitcher from "./RoleSwitcher";

export default function Navbar({ cartCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">
          <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#6c63ff" }}>Local<span style={{ color: "#333" }}>Link</span></span>
        </Link>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/agent/register" style={{ color: "#6c63ff", fontWeight: 600 }}>Become a Provider</Link></li>
        </ul>
      </nav>
      <div className="nav-right">
        <Link to="/cart" className="cart-icon">
          🛒
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <RoleSwitcher theme="light" />
            <div className="dropdown" ref={dropdownRef}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: open ? "#f0f0ff" : "#f5f5f5",
                border: "1.5px solid #e0e0ff",
                borderRadius: 24, padding: "7px 16px",
                cursor: "pointer", fontWeight: 600, fontSize: 14,
                color: "#333", transition: "background 0.15s",
              }}
            >
              <span style={{ fontSize: 18 }}>👤</span>
              {user.fullName?.split(" ")[0]}
              <span style={{ fontSize: 10, color: "#6c63ff", marginLeft: 2 }}>{open ? "▲" : "▼"}</span>
            </button>
            {open && (
              <div className="dropdown-content" style={{ display: "block" }}>
                <Link to="/my-account" onClick={() => setOpen(false)}>My Account</Link>
                <Link to="/my-orders" onClick={() => setOpen(false)}>My Orders</Link>
                <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid #f0f0f0" }} />
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "10px 16px", color: "#e53935",
                    background: "none", border: "none",
                    cursor: "pointer", fontSize: 14, fontWeight: 600,
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn-login">LOGIN</Link>
        )}
      </div>
    </div>
  );
}
