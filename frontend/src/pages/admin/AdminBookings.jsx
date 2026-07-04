import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/bookings")
      .then(r => setBookings(r.data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const getStatusClass = (status) => {
    if (status === "Served") return "served";
    if (status === "Cancelled") return "cancelled";
    return "pending";
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <AdminLayout title="Bookings">
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {["all", "Yet To Serve", "Served", "Cancelled"].map(f => (
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
            {f === "all" ? "All" : f} {f === "all" ? `(${bookings.length})` : `(${bookings.filter(b => b.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Agent</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b._id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{b.customerEmail}</div>
                  </td>
                  <td>{b.serviceId?.name}</td>
                  <td>{b.serviceProviderId?.name || <span style={{ color: "#ccc" }}>—</span>}</td>
                  <td style={{ fontSize: 13 }}>{new Date(b.date).toLocaleDateString()}</td>
                  <td style={{ fontSize: 13 }}>{b.timeSlot}</td>
                  <td style={{ color: "#6c63ff", fontWeight: 600 }}>₹{b.price}</td>
                  <td>
                    <span className={`badge-status ${getStatusClass(b.status)}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "#888", padding: 32 }}>No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
