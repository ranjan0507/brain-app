// src/pages/CategoriesPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CategoryList from "../components/CategoryList";
import type { Category } from "../types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/category");
      // backend may return either an array OR { categories: [...] }
      const data = Array.isArray(res.data) ? res.data : res.data?.categories ?? [];
      setCategories(data);
    } catch (err) {
      console.error("load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    if (!newName.trim()) return;
    try {
      const res = await api.post("/api/category", { name: newName.trim() });
      // backend response shape: { category: {...} } or { category: existing, message: "Already exists" }
      const created = res.data?.category ?? res.data;
      if (!created) throw new Error("Unexpected response from server");
      // keep list unique: remove existing with same id then add
      setCategories((prev) => [created, ...prev.filter((c) => String(c._id) !== String(created._id))]);
      setNewName("");
      // optionally navigate to the category page
      // navigate(`/categories/${created._id}`);
    } catch (err: any) {
      console.error("createCategory:", err);
      alert(err?.response?.data?.message ?? "Failed to create category");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete category?")) return;
    try {
      await api.delete(`/api/category/${id}`);
      setCategories((prev) => prev.filter((c) => String(c._id) !== String(id)));
    } catch (err) {
      console.error("deleteCategory:", err);
      alert("Failed to delete");
    }
  };

  const renameCategory = async (id: string) => {
    const name = prompt("New name") ?? "";
    if (!name.trim()) return;
    try {
      const res = await api.patch(`/api/category/${id}`, { name: name.trim() });
      const updated = res.data?.category ?? res.data;
      if (!updated) throw new Error("Unexpected response from server");
      setCategories((prev) => prev.map((c) => (String(c._id) === String(updated._id) ? updated : c)));
    } catch (err: any) {
      console.error("renameCategory:", err);
      alert(err?.response?.data?.message ?? "Failed to rename");
    }
  };

  if (loading) return <div className="text-white">Loading categories...</div>;

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-400">Categories</h1>
          <p className="text-sm text-gray-400 mt-1">Create, rename or delete categories. Click a category to open it.</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New category name"
            className="bg-[#0f0f0f] p-2 rounded border border-neutral-800"
          />
          <button onClick={createCategory} className="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded text-white">
            Create
          </button>
        </div>
      </div>

      <CategoryList
        categories={categories}
        onDelete={deleteCategory}
        onEdit={renameCategory}
        onOpen={(id) => navigate(`/categories/${id}`)}
      />
    </div>
  );
};
