import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";
import api from "../../utils/api";

export default function AdminAddService() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "", price: "", type: "", subCategory: "" });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newSubCat, setNewSubCat] = useState("");
  const [showNewSubCat, setShowNewSubCat] = useState(false);

  useEffect(() => {
    api.get("/categories/all").then(r => setCategories(r.data)).catch(() => {});
    if (isEdit) {
      api.get(`/services/${id}`).then(r => {
        const s = r.data;
        setForm({
          name: s.name,
          description: s.description,
          price: s.price,
          type: s.type?._id || s.type,
          subCategory: s.subCategory?._id || s.subCategory,
        });
        if (s.image) setImagePreview(s.image);
        if (s.type?._id) fetchSubCategories(s.type._id);
      }).catch(() => toast.error("Failed to load service"));
    }
  }, [id]);

  const fetchSubCategories = (categoryId) => {
    api.get(`/categories/${categoryId}/subcategories`).then(r => setSubCategories(r.data)).catch(() => {});
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setForm(f => ({ ...f, type: catId, subCategory: "" }));
    if (catId) fetchSubCategories(catId);
    else setSubCategories([]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleAddSubCat = async () => {
    if (!newSubCat.trim() || !form.type) return;
    try {
      const { data } = await api.post("/categories/subcategory", { title: newSubCat, categoryId: form.type });
      setSubCategories(s => [...s, data]);
      setForm(f => ({ ...f, subCategory: data._id }));
      setNewSubCat("");
      setShowNewSubCat(false);
      toast.success("Sub-category added");
    } catch {
      toast.error("Failed to add sub-category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("type", form.type);
      formData.append("subCategory", form.subCategory);
      if (imageFile) formData.append("image", imageFile);

      if (isEdit) {
        await api.put(`/services/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Service updated");
      } else {
        await api.post("/services", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Service created");
      }
      navigate("/admin/services");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? "Edit Service" : "Add Service"}>
      <div style={{ maxWidth: 700, background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Service Name</label>
            <input type="text" placeholder="e.g. Full Home Cleaning" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Describe the service..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" placeholder="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.type} onChange={handleCategoryChange} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ margin: 0 }}>Sub-Category</label>
              {form.type && (
                <button type="button" onClick={() => setShowNewSubCat(!showNewSubCat)}
                  style={{ background: "none", border: "none", color: "#6c63ff", cursor: "pointer", fontSize: 13 }}>
                  + New Sub-Category
                </button>
              )}
            </div>
            {showNewSubCat && (
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input type="text" placeholder="Sub-category name" value={newSubCat} onChange={e => setNewSubCat(e.target.value)}
                  style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #ddd", borderRadius: 8, fontSize: 14 }} />
                <button type="button" className="btn-primary" style={{ padding: "10px 16px" }} onClick={handleAddSubCat}>Add</button>
              </div>
            )}
            <select value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })} required>
              <option value="">Select Sub-Category</option>
              {subCategories.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Service Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="preview" style={{ marginTop: 12, width: 120, height: 90, objectFit: "cover", borderRadius: 8 }} />
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Service" : "Add Service"}
            </button>
            <button type="button" className="btn-outline" onClick={() => navigate("/admin/services")}>Cancel</button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
