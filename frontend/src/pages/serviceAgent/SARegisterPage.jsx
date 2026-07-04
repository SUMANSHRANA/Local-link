import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function SARegisterPage() {
  const [form, setForm] = useState({
    name: "", userName: "", password: "", serviceCategory: "",
    email: "", contact: "", experience: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/agent/register", form);
      toast.success(data.message || "Application submitted!");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-page" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
        <div className="form-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem" }}>✅</div>
          <h2 style={{ marginTop: 8 }}>Application Submitted!</h2>
          <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>
            Thanks for your interest in joining Local Link. Our team will review your
            application and approve your account soon. You'll be able to log in once approved.
          </p>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/agent/login")}>
            Go to Agent Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page" style={{ padding: "40px 20px", background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
      <div className="form-card" style={{ maxWidth: 540 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "3rem" }}>🛠️</div>
          <h2 style={{ marginTop: 8 }}>Become a Service Provider</h2>
          <p style={{ color: "#888", fontSize: 14 }}>Join Local Link and start getting bookings</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your full name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Service Category</label>
              <select value={form.serviceCategory}
                onChange={e => setForm({ ...form, serviceCategory: e.target.value })} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input type="tel" placeholder="Mobile number" value={form.contact}
                onChange={e => setForm({ ...form, contact: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input type="text" placeholder="e.g. 3 years" value={form.experience}
              onChange={e => setForm({ ...form, experience: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label>Choose Username</label>
              <input type="text" placeholder="Login username" value={form.userName}
                onChange={e => setForm({ ...form, userName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Choose Password</label>
              <input type="password" placeholder="Set a password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: 14 }} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
        <div className="form-link">
          Already a provider? <Link to="/agent/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
