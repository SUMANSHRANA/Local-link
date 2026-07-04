import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <div className="hero" style={{ padding: "60px 40px" }}>
        <h1>About Local Link</h1>
        <p>Your trusted home services partner</p>
      </div>
      <div className="section" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 60 }}>
          <div>
            <h2 style={{ marginBottom: 16 }}>Who We Are</h2>
            <p style={{ color: "#555", lineHeight: 1.8 }}>
              Local Link is a robust service provider management system inspired by platforms like UrbanClap. We are designed to streamline the process of connecting customers with high-quality services, backed by a dedicated team of in-house service professionals.
            </p>
            <p style={{ color: "#555", lineHeight: 1.8, marginTop: 16 }}>
              Unlike marketplaces, we ensure consistent quality and reliability by employing service providers as part of our team. Our unique algorithm automates the assignment of service providers to jobs based on availability.
            </p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #6c63ff, #3b3aab)", borderRadius: 20, padding: 40, color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🏠</div>
            <h3 style={{ marginBottom: 8 }}>Home Services Made Easy</h3>
            <p style={{ opacity: 0.9, lineHeight: 1.7 }}>Professional. Reliable. Affordable.</p>
          </div>
        </div>

        <h2 style={{ textAlign: "center", marginBottom: 32 }}>Our Features</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 24, marginBottom: 60 }}>
          {[
            { icon: "🤖", title: "Automated Assignment", desc: "Intelligent system that considers availability, service type, and scheduling." },
            { icon: "💬", title: "Customer Feedback", desc: "Built-in feedback mechanism for continuous improvement." },
            { icon: "📅", title: "Robust Scheduling", desc: "Book services at your convenience with smart time slot management." },
            { icon: "✅", title: "Verified Professionals", desc: "All service agents are vetted and trained in-house." },
          ].map(f => (
            <div key={f.title} style={{ background: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ marginBottom: 8, fontSize: "1rem" }}>{f.title}</h3>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#f0f0ff", borderRadius: 20, padding: 40, textAlign: "center" }}>
          <h2 style={{ marginBottom: 16 }}>Tech Stack</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 24 }}>
            {["MongoDB", "Express.js", "React.js", "Node.js"].map(t => (
              <div key={t} style={{ background: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 600, color: "#6c63ff", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
