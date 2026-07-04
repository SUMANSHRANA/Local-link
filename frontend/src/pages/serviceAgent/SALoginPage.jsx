import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function SALoginPage() {
  const [form, setForm] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/agent/login", form);
      // Store agent info merged as user for auth context
      login(data.token, { ...data.agent, role: "serviceAgent", fullName: data.agent.name });
      toast.success(`Welcome, ${data.agent.name}!`);
      navigate("/agent/dashboard");
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
          <div style={{ fontSize: "3rem" }}>👷</div>
          <h2 style={{ marginTop: 8 }}>Agent Login</h2>
          <p style={{ color: "#888", fontSize: 14 }}>Local Link Service Portal</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Your username"
              value={form.userName}
              onChange={e => setForm({ ...form, userName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: 14 }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="form-link">
          Want to offer services? <Link to="/agent/register">Join as a Provider</Link>
        </div>
      </div>
    </div>
  );
}
