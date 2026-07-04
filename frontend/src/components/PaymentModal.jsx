import React, { useState } from "react";
import UpiQRCode from "./UpiQRCode";

const METHODS = [
  { id: "UPI", label: "UPI / QR Code", icon: "📱" },
  { id: "Card", label: "Credit / Debit Card", icon: "💳" },
  { id: "Net Banking", label: "Net Banking", icon: "🏦" },
  { id: "Cash on Service", label: "Cash on Service", icon: "💵" },
];

export default function PaymentModal({ amount, onClose, onConfirm, processing }) {
  const [method, setMethod] = useState("UPI");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [upiPaid, setUpiPaid] = useState(false);

  const canPay =
    method === "Cash on Service" ||
    method === "Net Banking" ||
    (method === "UPI" && upiPaid) ||
    (method === "Card" && card.number.length >= 12 && card.expiry && card.cvv.length >= 3);

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 460, padding: 28, maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Complete Payment</h3>
          <span style={{ cursor: "pointer", fontSize: 20, color: "#888" }} onClick={onClose}>✕</span>
        </div>

        <div style={{ background: "#f7f6ff", borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#666" }}>Amount Payable</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#6c63ff" }}>₹{amount}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMethod(m.id); setUpiPaid(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 10px",
                borderRadius: 10, border: method === m.id ? "2px solid #6c63ff" : "1px solid #ddd",
                background: method === m.id ? "#f0eeff" : "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 600,
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 18 }}>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>

        {method === "UPI" && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 13.5, color: "#666", marginBottom: 12 }}>
              Scan this QR with any UPI app to pay <strong>₹{amount}</strong>
            </p>
            <div style={{ display: "inline-block", padding: 10, border: "1px solid #eee", borderRadius: 14 }}>
              <UpiQRCode amount={amount} note={`Local Link Booking - Rs ${amount}`} size={180} />
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
              Scannable real UPI QR (demo VPA) — no payment is actually settled
            </div>
            {!upiPaid ? (
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setUpiPaid(true)}>
                I've Scanned & Paid
              </button>
            ) : (
              <div style={{ marginTop: 16, color: "#2e7d32", fontWeight: 600 }}>✓ Payment confirmed</div>
            )}
          </div>
        )}

        {method === "Card" && (
          <div style={{ marginBottom: 20 }}>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "") })}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label>Expiry</label>
                <input type="text" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="password" placeholder="•••" maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>This is a demo — no real card is charged.</div>
          </div>
        )}

        {method === "Net Banking" && (
          <div style={{ marginBottom: 20, fontSize: 13.5, color: "#666", textAlign: "center", padding: "16px 0" }}>
            🏦 You'll be redirected to your bank's portal (demo only).
          </div>
        )}

        {method === "Cash on Service" && (
          <div style={{ marginBottom: 20, fontSize: 13.5, color: "#666", textAlign: "center", padding: "16px 0" }}>
            💵 Pay in cash to the service provider after the job is done.
          </div>
        )}

        <button
          className="btn-primary"
          style={{ width: "100%", padding: 14, opacity: canPay ? 1 : 0.5 }}
          disabled={!canPay || processing}
          onClick={() => onConfirm(method)}
        >
          {processing ? "Placing Order..." : `Confirm & Pay ₹${amount}`}
        </button>
      </div>
    </div>
  );
}
