import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";
import { placeholderImage, onImgError } from "../../utils/placeholder";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = () => {
    setLoading(true);
    api.get("/services")
      .then(r => setServices(r.data))
      .catch(() => toast.error("Failed to load services"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch {
      toast.error("Failed to delete service");
    }
  };

  return (
    <AdminLayout title="Services">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <Link to="/admin/services/add" className="btn-primary" style={{ textDecoration: "none", padding: "10px 20px" }}>
          + Add Service
        </Link>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s._id}>
                  <td>
                    <img
                      src={s.image || placeholderImage(s.name, 50, 50)}
                      alt={s.name}
                      onError={onImgError(s.name)}
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }}
                    />
                  </td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td>{s.type?.categoryName}</td>
                  <td>{s.subCategory?.title}</td>
                  <td style={{ color: "#6c63ff", fontWeight: 600 }}>₹{s.price}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link
                        to={`/admin/services/edit/${s._id}`}
                        style={{ background: "#6c63ff", color: "#fff", padding: "6px 14px", borderRadius: 6, textDecoration: "none", fontSize: 13 }}
                      >
                        Edit
                      </Link>
                      <button className="btn-danger" onClick={() => deleteService(s._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "#888", padding: 32 }}>No services found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
