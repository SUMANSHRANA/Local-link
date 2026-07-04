import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

// Generates a REAL UPI QR code — any UPI app (GPay/PhonePe/Paytm/etc.) will
// recognize and scan it because it encodes the standard UPI deep-link format:
//   upi://pay?pa=<VPA>&pn=<NAME>&am=<AMOUNT>&cu=INR&tn=<NOTE>
//
// IMPORTANT: This does NOT use Razorpay and does NOT require a merchant
// account — it's the open UPI intent spec that any VPA owner can use.
// Replace DEMO_VPA below with a real UPI ID you own if you want the
// scanning app to show a valid payee name instead of "invalid VPA".
const DEMO_VPA = "locallink@upi"; // <-- replace with a real UPI ID (e.g. yourname@oksbi) to test fully
const PAYEE_NAME = "Local Link Demo";

export default function UpiQRCode({ amount, note = "Local Link Booking Payment", size = 220 }) {
  const canvasRef = useRef(null);
  const [upiLink, setUpiLink] = useState("");

  useEffect(() => {
    const link =
      `upi://pay?pa=${encodeURIComponent(DEMO_VPA)}` +
      `&pn=${encodeURIComponent(PAYEE_NAME)}` +
      `&am=${encodeURIComponent(amount)}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(note)}`;
    setUpiLink(link);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, link, { width: size, margin: 1 }, () => {});
    }
  }, [amount, note, size]);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas ref={canvasRef} style={{ borderRadius: 12 }} />
      <div style={{ fontSize: 11, color: "#bbb", marginTop: 6, wordBreak: "break-all", maxWidth: size }}>
        {upiLink}
      </div>
    </div>
  );
}
