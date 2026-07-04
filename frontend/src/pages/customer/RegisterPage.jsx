import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "", emailAddress: "", password: "", contact: "",
    address: "", cityId: "", pin: "",
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/cities").then(r => setCities(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register-with-address", form);
      login(data.token, data.user);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page" style={{ padding: "40px 20px" }}>
      <div className="form-card" style={{ maxWidth: 500 }}>
        <h2>Create Account 🏠</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Your full name" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="your@email.com" value={form.emailAddress}
              onChange={e => setForm({ ...form, emailAddress: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Create a password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input type="tel" placeholder="Mobile number" value={form.contact}
              onChange={e => setForm({ ...form, contact: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="Street address" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label>City</label>
              <select value={form.cityId} onChange={e => setForm({ ...form, cityId: e.target.value })}>
                <option value="">Select City</option>
                {cities.map(c => <option key={c._id} value={c._id}>{c.cityName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>PIN Code</label>
              <input type="text" placeholder="PIN" value={form.pin}
                onChange={e => setForm({ ...form, pin: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <div className="form-link">Already have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  );
}
