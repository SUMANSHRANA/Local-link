import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../utils/api";

export default function MyAccountPage() {
  const [form, setForm] = useState({ fullName: "", emailAddress: "", contact: "", address: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/me").then(r => setForm(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/me", form);
      toast.success("Profile updated successfully");
    } catch { toast.error("Failed to update profile"); }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="form-page">
        <div className="form-card" style={{ maxWidth: 480 }}>
          <h2>My Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={form.fullName || ""} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.emailAddress || ""} onChange={e => setForm({ ...form, emailAddress: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input type="tel" value={form.contact || ""} onChange={e => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={form.address || ""} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
