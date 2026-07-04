import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";

export default function AdminCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cityName: "", stateName: "", countryName: "India" });
  const [saving, setSaving] = useState(false);

  const fetchCities = () => {
    setLoading(true);
    api.get("/cities/all")
      .then(r => setCities(r.data))
      .catch(() => toast.error("Failed to load cities"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCities(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/cities", form);
      toast.success("City added");
      setForm({ cityName: "", stateName: "", countryName: "India" });
      setShowForm(false);
      fetchCities();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add city");
    } finally {
      setSaving(false);
    }
  };

  const deleteCity = async (id) => {
    if (!window.confirm("Delete this city?")) return;
    try {
      await api.delete(`/cities/${id}`);
      toast.success("City deleted");
      fetchCities();
    } catch {
      toast.error("Failed to delete city");
    }
  };

  return (
    <AdminLayout title="Cities">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add City"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", padding: 28, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 28 }}>
          <h3 style={{ marginBottom: 20 }}>Add New City</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>City Name</label>
                <input type="text" placeholder="e.g. Mumbai" value={form.cityName} onChange={e => setForm({ ...form, cityName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>State Name</label>
                <input type="text" placeholder="e.g. Maharashtra" value={form.stateName} onChange={e => setForm({ ...form, stateName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input type="text" placeholder="e.g. India" value={form.countryName} onChange={e => setForm({ ...form, countryName: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Adding..." : "Add City"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading cities...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{c.cityName}</td>
                  <td>{c.stateName}</td>
                  <td>{c.countryName}</td>
                  <td>
                    <button className="btn-danger" onClick={() => deleteCity(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {cities.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "#888", padding: 32 }}>No cities added yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
