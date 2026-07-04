import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../utils/api";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data)).catch(() => {});
    api.get("/feedback").then(r => setTestimonials(r.data)).catch(() => {});
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/cart").then(r => setCartCount(r.data.items?.length || 0)).catch(() => {});
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${search}`);
  };

  const categoryIcons = ["🔧", "⚡", "🚿", "🌿", "🎨", "❄️", "🏠", "🔑"];

  return (
    <div>
      <Navbar cartCount={cartCount} />

      {/* Hero */}
      <div className="hero">
        <h1>Give Us A Chance To Serve You!</h1>
        <p>Professional home services at your doorstep</p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for a service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Categories */}
      <div className="section">
        <h2 className="section-title">Our Services</h2>
        <div className="category-grid">
          {categories.map((cat, i) => (
            <Link to={`/services?category=${cat._id}`} key={cat._id} className="category-card">
              {cat.imagePath
                ? <img src={cat.imagePath} alt={cat.categoryName} />
                : <div className="icon">{categoryIcons[i % categoryIcons.length]}</div>
              }
              <h3>{cat.categoryName}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Local Link */}
      <div className="section" style={{ background: "#fff" }}>
        <h2 className="section-title">Why Local Link?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
          {[
            { icon: "✅", title: "Verified Professionals", desc: "All service agents are background-checked and trained." },
            { icon: "📅", title: "Easy Scheduling", desc: "Book services at your convenient time and date." },
            { icon: "💰", title: "Best Prices", desc: "Transparent pricing with no hidden charges." },
            { icon: "⭐", title: "Quality Guaranteed", desc: "100% satisfaction guarantee on every service." },
          ].map(f => (
            <div key={f.title} style={{ textAlign: "center", padding: 24 }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div className="testimonials">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonial-grid">
            {testimonials.slice(0, 6).map(t => (
              <div key={t._id} className="testimonial-card">
                <div className="stars">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                <p>"{t.feedback}"</p>
                <div className="author">— {t.userId?.fullName || "Customer"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
