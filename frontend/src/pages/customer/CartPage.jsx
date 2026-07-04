import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../utils/api";
import { placeholderImage, onImgError } from "../../utils/placeholder";
import PaymentModal from "../../components/PaymentModal";

const TIME_SLOTS = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"];

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [dates, setDates] = useState({});
  const [timeSlots, setTimeSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  const fetchCart = () => {
    setLoading(true);
    api.get("/cart").then(r => setCart(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (serviceId) => {
    try {
      await api.delete(`/cart/remove/${serviceId}`);
      fetchCart();
      toast.success("Removed from cart");
    } catch { toast.error("Failed to remove item"); }
  };

  const handleCheckout = () => {
    const items = cart?.items || [];
    // Validate all items have date and time
    for (const item of items) {
      const sid = item.serviceId?._id;
      if (!dates[sid] || !timeSlots[sid]) {
        toast.warning("Please select date and time for all services");
        return;
      }
    }
    setShowPayment(true);
  };

  const placeOrder = async (paymentMethod) => {
    const items = cart?.items || [];
    setChecking(true);
    try {
      const selectedDates = {};
      const selectedTimeSlots = {};
      items.forEach(item => {
        const sid = item.serviceId?._id;
        selectedDates[sid] = dates[sid];
        selectedTimeSlots[sid] = timeSlots[sid];
      });
      await api.post("/bookings/checkout", { selectedDates, selectedTimeSlots, paymentMethod });
      toast.success("Order placed successfully!");
      setShowPayment(false);
      navigate("/my-orders");
    } catch (err) {
      const msg = err.response?.data?.message || "Checkout failed";
      toast.error(msg);
    } finally { setChecking(false); }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((acc, item) => acc + (item.serviceId?.price || 0), 0);

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div>
      <Navbar cartCount={items.length} />
      <div className="cart-page">
        <h2 style={{ marginBottom: 24 }}>Your Cart</h2>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "5rem", marginBottom: 16 }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p style={{ color: "#888", marginBottom: 24 }}>Browse services and add them to your cart</p>
            <button className="btn-primary" onClick={() => navigate("/services")}>Browse Services</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
            <div>
              {items.map(item => {
                const svc = item.serviceId;
                const sid = svc?._id;
                return (
                  <div key={item._id} className="cart-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <img src={svc?.image || placeholderImage(svc?.name, 80, 80)} alt={svc?.name} onError={onImgError(svc?.name)} />
                      <div style={{ flex: 1 }}>
                        <div className="info">
                          <h4>{svc?.name}</h4>
                          <p>{svc?.type?.categoryName}</p>
                        </div>
                      </div>
                      <div className="price">₹{svc?.price}</div>
                      <button className="btn-danger" onClick={() => removeItem(sid)}>Remove</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label>Select Date</label>
                        <input type="date" min={new Date().toISOString().split("T")[0]} value={dates[sid] || ""} onChange={e => setDates(d => ({ ...d, [sid]: e.target.value }))} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label>Select Time Slot</label>
                        <select value={timeSlots[sid] || ""} onChange={e => setTimeSlots(t => ({ ...t, [sid]: e.target.value }))}>
                          <option value="">Choose time</option>
                          {TIME_SLOTS.map(ts => <option key={ts} value={ts}>{ts}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <div style={{ background: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", position: "sticky", top: 80 }}>
                <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
                {items.map(item => (
                  <div key={item._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                    <span>{item.serviceId?.name}</span>
                    <span>₹{item.serviceId?.price}</span>
                  </div>
                ))}
                <hr style={{ margin: "16px 0", borderColor: "#f0f0f0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", marginBottom: 24 }}>
                  <span>Total</span>
                  <span style={{ color: "#6c63ff" }}>₹{subtotal}</span>
                </div>
                <button className="btn-primary" style={{ width: "100%", padding: 14 }} onClick={handleCheckout} disabled={checking}>
                  {checking ? "Processing..." : "Proceed to Pay"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showPayment && (
        <PaymentModal
          amount={subtotal}
          processing={checking}
          onClose={() => setShowPayment(false)}
          onConfirm={(method) => placeOrder(method)}
        />
      )}
      <Footer />
    </div>
  );
}
