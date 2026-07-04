import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import RoleSwitcher from "../../components/RoleSwitcher";

const STATUS_OPTIONS = ["Yet To Serve", "Serving", "Served"];

export default function SADashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = () => {
    setLoading(true);
    api.get("/bookings/agent")
      .then(r => setBookings(r.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      setBookings(b => b.map(x => x._id === bookingId ? { ...x, status } : x));
      toast.success(`Status updated to "${status}"`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/agent/login");
  };

  const getStatusClass = (status) => {
    if (status === "Served") return "served";
    if (status === "Cancelled") return "cancelled";
    return "pending";
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "Yet To Serve").length,
    serving: bookings.filter(b => b.status === "Serving").length,
    served: bookings.filter(b => b.status === "Served").length,
  };

  return (
    <div>
      {/* Agent Navbar */}
      <div className="navbar">
        <div>
          <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#6c63ff" }}>Vee<span style={{ color: "#333" }}>Serve</span></span>
          <span style={{ marginLeft: 12, fontSize: 13, color: "#888" }}>Service Portal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14 }}>👷 {user?.fullName || user?.name}</span>
          <RoleSwitcher theme="light" />
          <button
            onClick={handleLogout}
            style={{ background: "#e74c3c", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: 32 }}>
        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 32 }}>
          {[
            { label: "Total Assigned", value: counts.total, icon: "📋" },
            { label: "Yet To Serve", value: counts.pending, icon: "⏳" },
            { label: "Currently Serving", value: counts.serving, icon: "🔧" },
            { label: "Completed", value: counts.served, icon: "✅" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{s.icon}</div>
              <div className="label">{s.label}</div>
              <div className="value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {["all", "Yet To Serve", "Serving", "Served"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                background: filter === f ? "#6c63ff" : "#f0f0f0",
                color: filter === f ? "#fff" : "#333",
                fontWeight: filter === f ? 600 : 400,
                fontSize: 13,
              }}
            >
              {f === "all" ? `All (${counts.total})` : f}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="loading">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>📭</div>
            <p>No bookings in this category</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {filtered.map(b => (
              <div
                key={b._id}
                style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <h3 style={{ fontSize: "1.05rem" }}>{b.serviceId?.name}</h3>
                    <span className={`badge-status ${getStatusClass(b.status)}`}>{b.status}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10, fontSize: 14, color: "#555" }}>
                    <div><span style={{ fontWeight: 600 }}>👤 Customer:</span> {b.customerId?.fullName || b.customerName}</div>
                    <div><span style={{ fontWeight: 600 }}>📧 Email:</span> {b.customerId?.emailAddress || b.customerEmail}</div>
                    <div><span style={{ fontWeight: 600 }}>📞 Phone:</span> {b.customerId?.contact || b.customerPhone}</div>
                    <div><span style={{ fontWeight: 600 }}>📅 Date:</span> {new Date(b.date).toLocaleDateString()}</div>
                    <div><span style={{ fontWeight: 600 }}>⏰ Time:</span> {b.timeSlot}</div>
                    <div><span style={{ fontWeight: 600 }}>💰 Price:</span> <span style={{ color: "#6c63ff", fontWeight: 700 }}>₹{b.price}</span></div>
                  </div>
                </div>
                {b.status !== "Served" && b.status !== "Cancelled" && (
                  <div>
                    <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Update Status</label>
                    <select
                      value={b.status}
                      onChange={e => updateStatus(b._id, e.target.value)}
                      style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 13, cursor: "pointer", outline: "none" }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
