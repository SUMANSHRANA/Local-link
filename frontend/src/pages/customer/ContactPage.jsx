import React, { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../utils/api";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/feedback/contact", form);
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="hero" style={{ padding: "60px 40px" }}>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>
      <div className="section">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 900, margin: "0 auto" }}>
          <div>
            <h2 style={{ marginBottom: 24 }}>Get In Touch</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { icon: "📧", label: "Email", value: "support@locallink.com" },
                { icon: "📞", label: "Phone", value: "+91 9876543210" },
                { icon: "🕐", label: "Business Hours", value: "Mon–Sat, 9 AM – 7 PM" },
                { icon: "📍", label: "Location", value: "Mumbai, Maharashtra, India" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <span style={{ fontSize: "1.8rem" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: "#666", fontSize: 14 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#fff", padding: 32, borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <h2 style={{ marginBottom: 24 }}>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="How can we help you?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
