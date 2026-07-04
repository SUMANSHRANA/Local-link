import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";
import { placeholderImage, onImgError } from "../../utils/placeholder";

const EMPTY_FORM = {
  name: "", serviceCategory: "", userName: "", password: "",
  email: "", contact: "", address: "", experience: "",
};

const EMPTY_EDIT = {
  name: "", serviceCategory: "", email: "", contact: "", address: "", experience: "", isAvailable: true,
};

export default function AdminServiceAgents() {
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editAgent, setEditAgent] = useState(null); // agent being edited
  const [editForm, setEditForm] = useState(EMPTY_EDIT);
  const [editImage, setEditImage] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [viewAgent, setViewAgent] = useState(null); // agent detail drawer

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.get("/service-agents"), api.get("/categories/all")])
      .then(([agentsRes, catsRes]) => {
        setAgents(agentsRes.data);
        setCategories(catsRes.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Add Agent ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append("image", imageFile);
      await api.post("/service-agents", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Service agent added");
      setShowForm(false);
      setForm(EMPTY_FORM);
      setImageFile(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add agent");
    } finally {
      setSaving(false);
    }
  };

  // ── Edit Agent ─────────────────────────────────────────────────────────────
  const openEdit = (a) => {
    setEditAgent(a);
    setEditForm({
      name: a.name || "",
      serviceCategory: a.serviceCategory?._id || "",
      email: a.email || "",
      contact: a.contact || "",
      address: a.address || "",
      experience: a.experience || "",
      isAvailable: a.isAvailable ?? true,
    });
    setEditImage(null);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
      if (editImage) fd.append("image", editImage);
      const { data } = await api.put(`/service-agents/${editAgent._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Agent updated");
      setAgents(prev => prev.map(a => a._id === data._id ? data : a));
      setEditAgent(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update agent");
    } finally {
      setEditSaving(false);
    }
  };

  // ── Approve / Delete ───────────────────────────────────────────────────────
  const approveAgent = async (id) => {
    try {
      await api.put(`/service-agents/${id}/approve`);
      toast.success("Agent approved");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve agent");
    }
  };

  const deleteAgent = async (id) => {
    if (!window.confirm("Delete this service agent?")) return;
    try {
      await api.delete(`/service-agents/${id}`);
      toast.success("Agent deleted");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete agent");
    }
  };

  // ── UI helpers ─────────────────────────────────────────────────────────────
  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 };
  const infoRow = (icon, label, value) => value ? (
    <div style={{ marginBottom: 10 }}>
      <div style={labelStyle}>{icon} {label}</div>
      <div style={{ fontSize: 14, color: "#333" }}>{value}</div>
    </div>
  ) : null;

  return (
    <AdminLayout title="Service Agents">

      {/* ── Top bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ color: "#888", fontSize: 14 }}>{agents.length} agents total</p>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Agent"}
        </button>
      </div>

      {/* ── Add form ── */}
      {showForm && (
        <div style={{ background: "#fff", padding: 28, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 28 }}>
          <h3 style={{ marginBottom: 20 }}>Add New Service Agent</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" placeholder="Agent full name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Service Category *</label>
                <select value={form.serviceCategory} onChange={e => setForm({ ...form, serviceCategory: e.target.value })} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Username *</label>
                <input type="text" placeholder="Login username" value={form.userName}
                  onChange={e => setForm({ ...form, userName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" placeholder="Set password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="agent@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input type="tel" placeholder="+91 98765 43210" value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label>Address</label>
                <input type="text" placeholder="Full address" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Experience</label>
                <input type="text" placeholder="e.g. 5 years" value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Adding…" : "Add Agent"}
            </button>
          </form>
        </div>
      )}

      {/* ── Agents table ── */}
      {loading ? (
        <div className="loading">Loading agents…</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Category</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(a => (
                <tr key={a._id}>
                  <td>
                    <img
                      src={a.image || placeholderImage(a.name, 45, 45)}
                      alt={a.name}
                      onError={onImgError(a.name)}
                      style={{ width: 45, height: 45, borderRadius: "50%", objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>{a.userName}</div>
                    {a.email && <div style={{ fontSize: 12, color: "#6c63ff" }}>{a.email}</div>}
                  </td>
                  <td style={{ fontSize: 14 }}>{a.contact || <span style={{ color: "#ccc" }}>—</span>}</td>
                  <td style={{ fontSize: 13, color: "#555", maxWidth: 160, wordBreak: "break-word" }}>
                    {a.address || <span style={{ color: "#ccc" }}>—</span>}
                  </td>
                  <td>
                    <span style={{ background: "#f0f0ff", color: "#6c63ff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                      {a.serviceCategory?.categoryName}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{a.experience || <span style={{ color: "#ccc" }}>—</span>}</td>
                  <td>
                    {a.isApproved ? (
                      <div>
                        <div style={{ color: "#2e7d32", fontWeight: 600, fontSize: 13 }}>✓ Approved</div>
                        <div style={{ fontSize: 12, color: a.isAvailable ? "#43a047" : "#e53935" }}>
                          {a.isAvailable ? "● Available" : "● Unavailable"}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: "#e67e22", fontWeight: 600, fontSize: 13 }}>⏳ Pending</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <button className="btn" style={{ fontSize: 12, padding: "5px 12px" }}
                        onClick={() => setViewAgent(a)}>👁 View</button>
                      <button className="btn" style={{ fontSize: 12, padding: "5px 12px", background: "#6c63ff", color: "#fff", border: "none" }}
                        onClick={() => openEdit(a)}>✏️ Edit</button>
                      {!a.isApproved && (
                        <button className="btn" style={{ fontSize: 12, padding: "5px 12px" }}
                          onClick={() => approveAgent(a._id)}>✓ Approve</button>
                      )}
                      <button className="btn-danger" style={{ fontSize: 12, padding: "5px 12px" }}
                        onClick={() => deleteAgent(a._id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", color: "#888", padding: 40 }}>No agents yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── View detail drawer ── */}
      {viewAgent && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "flex-end",
        }} onClick={() => setViewAgent(null)}>
          <div style={{
            width: 380, height: "100vh", background: "#fff", overflowY: "auto",
            boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", padding: 32,
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0 }}>Agent Details</h3>
              <button onClick={() => setViewAgent(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>✕</button>
            </div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <img
                src={viewAgent.image || placeholderImage(viewAgent.name, 90, 90)}
                alt={viewAgent.name}
                onError={onImgError(viewAgent.name)}
                style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", border: "3px solid #f0f0ff" }}
              />
              <h2 style={{ marginTop: 12, marginBottom: 4 }}>{viewAgent.name}</h2>
              <span style={{ background: "#f0f0ff", color: "#6c63ff", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                {viewAgent.serviceCategory?.categoryName}
              </span>
            </div>

            <div style={{ background: "#f9f9ff", borderRadius: 12, padding: 20 }}>
              {infoRow("📧", "Email", viewAgent.email)}
              {infoRow("📞", "Contact", viewAgent.contact)}
              {infoRow("📍", "Address", viewAgent.address)}
              {infoRow("⏱️", "Experience", viewAgent.experience)}
              {infoRow("👤", "Username", viewAgent.userName)}
              <div style={{ marginBottom: 10 }}>
                <div style={labelStyle}>✅ Status</div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <span style={{
                    padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: viewAgent.isApproved ? "#e8f5e9" : "#fff3e0",
                    color: viewAgent.isApproved ? "#2e7d32" : "#e67e22",
                  }}>
                    {viewAgent.isApproved ? "Approved" : "Pending"}
                  </span>
                  <span style={{
                    padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: viewAgent.isAvailable ? "#e8f5e9" : "#ffebee",
                    color: viewAgent.isAvailable ? "#43a047" : "#e53935",
                  }}>
                    {viewAgent.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setViewAgent(null); openEdit(viewAgent); }}>
                ✏️ Edit Agent
              </button>
              {!viewAgent.isApproved && (
                <button className="btn" style={{ flex: 1 }} onClick={() => { approveAgent(viewAgent._id); setViewAgent(null); }}>
                  ✓ Approve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Edit modal ── */}
      {editAgent && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setEditAgent(null)}>
          <div style={{
            width: 600, maxHeight: "90vh", overflowY: "auto",
            background: "#fff", borderRadius: 20, padding: 36,
            boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0 }}>Edit — {editAgent.name}</h3>
              <button onClick={() => setEditAgent(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888" }}>✕</button>
            </div>
            <form onSubmit={handleEdit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Service Category *</label>
                  <select value={editForm.serviceCategory} onChange={e => setEditForm({ ...editForm, serviceCategory: e.target.value })} required>
                    <option value="">Select</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="tel" value={editForm.contact} onChange={e => setEditForm({ ...editForm, contact: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>Address</label>
                  <input type="text" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input type="text" value={editForm.experience} onChange={e => setEditForm({ ...editForm, experience: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <select value={editForm.isAvailable} onChange={e => setEditForm({ ...editForm, isAvailable: e.target.value === "true" })}>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label>Update Profile Photo</label>
                  <input type="file" accept="image/*" onChange={e => setEditImage(e.target.files[0])} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={editSaving}>
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
                <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setEditAgent(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
