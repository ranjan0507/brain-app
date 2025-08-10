import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Category } from "../types";

export default function AddLinkPage() {
  const [url, setUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [catId, setCatId] = useState("");
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    axios.get("/api/category", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCategories(Array.isArray(res.data) ? res.data : res.data?.categories ?? []))
      .catch(err => console.error(err));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !catId) return alert("URL + Category required");
    setLoading(true);
    try {
      await axios.post("/api/content", { url, categoryId: catId }, { headers: { Authorization: `Bearer ${token}` } });
      navigate("/my");
    } catch (err) {
      console.error(err);
      alert("Failed to add link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-purple-400 mb-4">Add Link</h1>
      <form onSubmit={submit} className="max-w-lg space-y-3">
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="bg-[#0f0f0f] p-2 rounded border border-neutral-800 w-full" />
        <select value={catId} onChange={(e) => setCatId(e.target.value)} className="bg-[#0f0f0f] p-2 rounded border border-neutral-800 w-full">
          <option value="">Select category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <button className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded text-white" disabled={loading}>{loading ? "Adding..." : "Add Link"}</button>
      </form>
    </div>
  );
}
