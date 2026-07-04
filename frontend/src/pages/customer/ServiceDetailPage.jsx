import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../utils/api";
import { placeholderImage, onImgError } from "../../utils/placeholder";
import { useAuth } from "../../context/AuthContext";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [agents, setAgents] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/services/${id}`)
      .then(r => {
        setService(r.data);
        // fetch agents for this service's category
        const categoryId = r.data.type?._id || r.data.type;
        if (categoryId) {
          api.get(`/service-agents/by-category/${categoryId}`)
            .then(res => setAgents(res.data))
            .catch(() => {});
        }
      })
      .catch(() => navigate("/services"));

    if (localStorage.getItem("token")) {
      api.get("/cart").then(r => setCartCount(r.data.items?.length || 0)).catch(() => {});
    }
  }, [id]);

  const addToCart = async () => {
    if (!user || !localStorage.getItem("token")) {
      toast.info("Please login to add to cart");
      navigate("/login");
      return;
    }
    if (user.role !== "customer") {
      toast.info("Please login as a customer to add to cart");
      return;
    }
    try {
      await api.post("/cart/add", { serviceId: id });
      setCartCount(c => c + 1);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (!service) return <div className="loading">Loading…</div>;

  return (
    <div>
      <Navbar cartCount={cartCount} />

      <div className="section" style={{ maxWidth: 960, margin: "0 auto" }}>
        <button onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "#6c63ff", cursor: "pointer", fontSize: 15, marginBottom: 24 }}>
          ← Back
        </button>

        {/* ── Service card ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
          background: "#fff", borderRadius: 20, overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: 48,
        }}>
          <img
            src={service.image || placeholderImage(service.name, 400, 300)}
            alt={service.name}
            onError={onImgError(service.name)}
            style={{ width: "100%", height: 400, objectFit: "cover" }}
          />
          <div style={{ padding: 40 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
              {service.type?.categoryName} › {service.subCategory?.title}
            </div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: 12 }}>{service.name}</h1>
            <p style={{ color: "#555", lineHeight: 1.7, marginBottom: 24 }}>{service.description}</p>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#6c63ff", marginBottom: 24 }}>₹{service.price}</div>
            <button className="btn-primary" style={{ width: "100%", padding: 16, fontSize: 16 }} onClick={addToCart}>
              🛒 Add to Cart
            </button>
            <div style={{ marginTop: 20, padding: 16, background: "#f0f0ff", borderRadius: 10 }}>
              <p style={{ fontSize: 13, color: "#555" }}>
                ✅ Verified professionals &nbsp;|&nbsp; 📅 Flexible scheduling &nbsp;|&nbsp; 💰 Best price guarantee
              </p>
            </div>
          </div>
        </div>

        {/* ── Available Service Providers ── */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 6 }}>
            Available Service Providers
          </h2>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
            Our verified professionals for {service.type?.categoryName}
          </p>

          {agents.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 0",
              background: "#f9f9f9", borderRadius: 16, color: "#bbb",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>👷</div>
              <p style={{ fontSize: 15 }}>No providers listed yet for this category.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {agents.map(a => (
                <div key={a._id} style={{
                  background: "#fff", borderRadius: 16, padding: 24,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  border: "1px solid #f0f0f0",
                  transition: "box-shadow 0.2s",
                }}>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <img
                      src={a.image || placeholderImage(a.name, 56, 56)}
                      alt={a.name}
                      onError={onImgError(a.name)}
                      style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: "2px solid #f0f0ff" }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#222" }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: a.isAvailable ? "#43a047" : "#e53935", fontWeight: 600, marginTop: 2 }}>
                        {a.isAvailable ? "● Available" : "● Unavailable"}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {a.contact && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                        <span style={{ fontSize: 15 }}>📞</span>
                        <a href={`tel:${a.contact}`} style={{ color: "#6c63ff", textDecoration: "none", fontWeight: 500 }}>
                          {a.contact}
                        </a>
                      </div>
                    )}
                    {a.email && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                        <span style={{ fontSize: 15 }}>📧</span>
                        <a href={`mailto:${a.email}`} style={{ color: "#6c63ff", textDecoration: "none", fontWeight: 500 }}>
                          {a.email}
                        </a>
                      </div>
                    )}
                    {a.address && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                        <span style={{ fontSize: 15, marginTop: 1 }}>📍</span>
                        <span style={{ color: "#555" }}>{a.address}</span>
                      </div>
                    )}
                    {a.experience && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                        <span style={{ fontSize: 15 }}>⏱️</span>
                        <span style={{ color: "#555" }}>{a.experience} experience</span>
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #f5f5f5" }}>
                    <span style={{
                      background: "#f0f0ff", color: "#6c63ff",
                      padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                    }}>
                      {a.serviceCategory?.categoryName || service.type?.categoryName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
