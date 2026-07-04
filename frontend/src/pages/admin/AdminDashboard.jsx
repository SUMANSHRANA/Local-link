import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="loading">Loading stats...</div></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        {[
          { label: "Orders This Month", value: stats?.orderCount || 0, icon: "📋" },
          { label: "Revenue This Month", value: `₹${stats?.totalRevenue || 0}`, icon: "💰" },
          { label: "New Customers", value: stats?.customerCount || 0, icon: "👥" },
          { label: "Cities Served", value: stats?.cityCount || 0, icon: "🏙️" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{s.icon}</div>
            <div className="label">{s.label}</div>
            <div className="value">{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Top Services */}
        <div className="table-container" style={{ padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
            <h3 style={{ fontSize: "1rem" }}>Top Services This Month</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Bookings</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.topServices || []).map((s, i) => (
                <tr key={i}>
                  <td>{s.serviceName}</td>
                  <td>{s.totalBookings}</td>
                  <td style={{ color: "#6c63ff", fontWeight: 600 }}>₹{s.totalRevenue}</td>
                </tr>
              ))}
              {(!stats?.topServices?.length) && (
                <tr><td colSpan={3} style={{ textAlign: "center", color: "#888" }}>No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Customers */}
        <div className="table-container" style={{ padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
            <h3 style={{ fontSize: "1rem" }}>Recent Customers</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentUsers || []).map(u => (
                <tr key={u._id}>
                  <td>{u.fullName}</td>
                  <td style={{ fontSize: 13, color: "#666" }}>{u.emailAddress}</td>
                  <td style={{ fontSize: 13, color: "#666" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!stats?.recentUsers?.length) && (
                <tr><td colSpan={3} style={{ textAlign: "center", color: "#888" }}>No customers yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
