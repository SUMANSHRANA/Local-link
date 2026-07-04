import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { emailAddress: email });
      setSent(true);
      toast.success("Reset email sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Forgot Password 🔑</h2>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
            <p style={{ color: "#555", marginBottom: 24 }}>Password reset email sent! Check your inbox.</p>
            <Link to="/login" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Enter your email address and we'll send you a link to reset your password.</p>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="form-link" style={{ marginTop: 16 }}>
              <Link to="/login">← Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
