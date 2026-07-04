import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import api from "../../utils/api";
import { placeholderImage, onImgError } from "../../utils/placeholder";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    api.get("/categories").then(r => setCategories(r.data)).catch(() => {});
    const token = localStorage.getItem("token");
    if (token) api.get("/cart").then(r => setCartCount(r.data.items?.length || 0)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (categoryFilter) params.category = categoryFilter;
    api.get("/services", { params }).then(r => {
      let data = r.data;
      if (searchQuery) {
        data = data.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      setServices(data);
    }).catch(() => toast.error("Failed to load services"))
      .finally(() => setLoading(false));
  }, [categoryFilter, searchQuery]);

  const addToCart = async (serviceId) => {
    const token = localStorage.getItem("token");
    if (!token) { toast.info("Please login to add to cart"); return; }
    try {
      await api.post("/cart/add", { serviceId });
      setCartCount(c => c + 1);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const selectedCategory = categories.find(c => c._id === categoryFilter);

  return (
    <div>
      <Navbar cartCount={cartCount} />
      <div className="section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            {selectedCategory ? selectedCategory.categoryName : searchQuery ? `Results for "${searchQuery}"` : "All Services"}
          </h2>
          {categoryFilter && (
            <Link to="/services" style={{ color: "#6c63ff", fontSize: 14 }}>← All Services</Link>
          )}
        </div>
        {loading ? (
          <div className="loading">Loading services...</div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔍</div>
            <p>No services found.</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map(s => (
              <div key={s._id} className="service-card">
                <img src={s.image || placeholderImage(s.name, 300, 180)} alt={s.name} onError={onImgError(s.name)} />
                <div className="card-body">
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{s.type?.categoryName}</div>
                  <h3>{s.name}</h3>
                  <p>{s.description?.substring(0, 80)}...</p>
                  <div className="price">₹{s.price}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <Link to={`/services/${s._id}`} className="btn-outline" style={{ textDecoration: "none", fontSize: 13, padding: "8px 14px" }}>
                      Details
                    </Link>
                    <button className="btn" onClick={() => addToCart(s._id)}>Add to Cart</button>
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
