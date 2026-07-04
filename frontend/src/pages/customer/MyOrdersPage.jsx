import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../utils/api";

export default function MyOrdersPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/my-orders")
      .then(r => setBookings(r.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/cancel/${id}`);
      setBookings(b => b.map(x => x._id === id ? { ...x, status: "Cancelled" } : x));
      toast.success("Booking cancelled");
    } catch { toast.error("Failed to cancel booking"); }
  };

  const getStatusClass = (status) => {
    if (status === "Served") return "served";
    if (status === "Cancelled") return "cancelled";
    return "pending";
  };

  return (
    <div>
      <Navbar />
      <div className="section" style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 24 }}>My Orders</h2>
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>📋</div>
            <p>No orders yet</p>
          </div>
        ) : (
          <div>
            {bookings.map(b => (
              <div key={b._id} style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h4 style={{ marginBottom: 4 }}>{b.serviceId?.name}</h4>
                    <p style={{ color: "#888", fontSize: 14 }}>{b.serviceCategoryId?.categoryName}</p>
                    <div style={{ marginTop: 12, fontSize: 14, color: "#555" }}>
                      <span>📅 {new Date(b.date).toLocaleDateString()}</span>
                      <span style={{ marginLeft: 16 }}>⏰ {b.timeSlot}</span>
                      <span style={{ marginLeft: 16 }}>👤 {b.serviceProviderId?.name || "Assigning..."}</span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "#999" }}>
                      💳 {b.paymentMethod || "Cash on Service"} · {b.paymentStatus === "Paid" ? <span style={{ color: "#2e7d32" }}>Paid</span> : "Payment Pending"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className={`badge-status ${getStatusClass(b.status)}`}>{b.status}</span>
                    <div style={{ fontWeight: 700, color: "#6c63ff", fontSize: "1.1rem", marginTop: 8 }}>₹{b.price}</div>
                    {b.status === "Yet To Serve" && (
                      <button className="btn-danger" style={{ marginTop: 12 }} onClick={() => cancelBooking(b._id)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
