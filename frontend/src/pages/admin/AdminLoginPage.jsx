import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ emailAddress: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/admin/login", form);
      login(data.token, data.user);
      toast.success("Welcome, Admin!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
      <div className="form-card">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: "3rem" }}>🔐</div>
          <h2 style={{ marginTop: 8 }}>Admin Login</h2>
          <p style={{ color: "#888", fontSize: 14 }}>Local Link Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="admin@locallink.com"
              value={form.emailAddress}
              onChange={e => setForm({ ...form, emailAddress: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: 14 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
