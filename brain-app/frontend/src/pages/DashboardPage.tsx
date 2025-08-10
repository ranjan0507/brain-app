// src/pages/DashboardPage.tsx
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import CategoryList from "../components/CategoryList";
import ContentList from "../components/ContentList";
import CreateContentModal from "../components/CreateContentModal";
import type { Category, ContentItem } from "../types";

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, contRes] = await Promise.all([api.get("/api/category"), api.get("/api/content")]);
      setCategories(Array.isArray(cRes.data) ? cRes.data : cRes.data?.categories ?? []);
      setContents(Array.isArray(contRes.data) ? contRes.data : contRes.data?.contents ?? []);
    } catch (err) {
      console.error("dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    return contents.reduce<Record<string, number>>((acc, item) => {
      const k = (item.type || "other").toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
  }, [contents]);

  const recent = useMemo(() => {
    return [...contents].sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 6);
  }, [contents]);

  const onCreated = (created: ContentItem) => {
    fetchAll();
    setCreateOpen(false);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-400">Dashboard</h1>
        <button onClick={() => setCreateOpen(true)} className="bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded text-white">Add Content</button>
      </header>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.keys(stats).length === 0 ? <div className="text-gray-400">No items yet</div> : Object.entries(stats).map(([k, v]) => (
            <div key={k} className="bg-[#0f0f0f] p-4 rounded border border-neutral-800">
              <div className="text-sm text-gray-400 capitalize">{k}</div>
              <div className="text-2xl font-bold">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Recently Added</h2>
        <div className="space-y-2">
          {recent.length === 0 ? <div className="text-gray-400">No recent content</div> : recent.map(item => (
            <div key={item._id} className="bg-[#0f0f0f] p-3 rounded border border-neutral-800 flex justify-between">
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-gray-400">{item.type ?? "other"} • {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Categories</h2>
          <CategoryList categories={categories} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">All Content</h2>
          <ContentList contents={contents} categories={categories} />
        </div>
      </section>

      <CreateContentModal open={createOpen} categories={categories} onClose={() => setCreateOpen(false)} onCreated={onCreated} />
    </div>
  );
}
