import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

// Reusable email OTP verification block.
// Props:
//   email: current email value from the parent form
//   purpose: "register" | "agent-register"
//   verified: boolean (lifted state from parent)
//   onVerified: (bool) => void  — called when verification status changes
export default function EmailOtpVerify({ email, purpose, verified, onVerified }) {
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const sendOtp = async () => {
    if (!email) { toast.warning("Enter your email first"); return; }
    setSending(true);
    try {
      await api.post("/auth/send-otp", { emailAddress: email, purpose });
      toast.success("OTP sent to your email");
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) { toast.warning("Enter the OTP sent to your email"); return; }
    setVerifying(true);
    try {
      await api.post("/auth/verify-otp", { emailAddress: email, otp, purpose });
      toast.success("Email verified!");
      onVerified(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  if (verified) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#2e7d32", fontSize: 13, fontWeight: 600, margin: "-8px 0 14px" }}>
        ✓ Email verified
      </div>
    );
  }

  return (
    <div style={{ margin: "-8px 0 14px" }}>
      {!sent ? (
        <button
          type="button"
          onClick={sendOtp}
          disabled={sending || !email}
          style={{ fontSize: 13, color: "#6c63ff", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}
        >
          {sending ? "Sending OTP..." : "Send verification code to this email"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="6-digit OTP"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            style={{ width: 120, padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}
          />
          <button
            type="button"
            className="btn-outline"
            style={{ padding: "8px 14px", fontSize: 13 }}
            onClick={verifyOtp}
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={sendOtp}
            disabled={sending}
            style={{ fontSize: 12, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            Resend
          </button>
        </div>
      )}
    </div>
  );
}
