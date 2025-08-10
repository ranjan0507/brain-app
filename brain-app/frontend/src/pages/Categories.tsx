import { useEffect, useState } from "react";
import axios from "axios";
import CategoryList from "../components/CategoryList";
import type { Category } from "../types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    axios.get("/api/category", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCategories(Array.isArray(res.data) ? res.data : res.data?.categories ?? []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const createCategory = async () => {
    if (!newName.trim()) return;
    try {
      const res = await axios.post("/api/category", { name: newName }, { headers: { Authorization: `Bearer ${token}` } });
      const created = res.data;
      setCategories(prev => [created, ...prev]);
      setNewName("");
    } catch (err) {
      console.error(err);
      alert("Failed to create category");
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete category?")) return;
    try {
      await axios.delete(`/api/category/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const renameCategory = async (id: string) => {
    const name = prompt("New name") ?? "";
    if (!name) return;
    try {
      const res = await axios.patch(`/api/category/${id}`, { name }, { headers: { Authorization: `Bearer ${token}` } });
      const updated = res.data;
      setCategories(prev => prev.map(c => (c._id === id ? updated : c)));
    } catch (err) {
      console.error(err);
      alert("Failed to rename");
    }
  };

  if (loading) return <div className="text-white">Loading categories...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-purple-400 mb-4">Categories</h1>
      <div className="mb-4 flex gap-2">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New category name" className="bg-[#0f0f0f] p-2 rounded border border-neutral-800" />
        <button onClick={createCategory} className="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded text-white">Create</button>
      </div>

      <CategoryList categories={categories} onEdit={renameCategory} onDelete={deleteCategory} />
    </div>
  );
}
