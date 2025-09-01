// src/pages/DashboardPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CategoryList from "../components/CategoryList";
import ContentList from "../components/ContentList";
import CreateContentModal from "../components/CreateContentModal";
import type { Category, ContentItem } from "../types";
import Embed from "../components/Embed";

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, contRes] = await Promise.all([
        api.get("/api/category"),
        api.get("/api/content"),
      ]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NOTE: Embed scripts are handled inside the Embed component to avoid duplication.

  const stats = useMemo(() => {
    return contents.reduce<Record<string, number>>((acc, item) => {
      const k = (item.type || "other").toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});
  }, [contents]);

  const recent = useMemo(() => {
    return [...contents]
      .sort((a, b) => new Date((b.createdAt as string) ?? 0).getTime() - new Date((a.createdAt as string) ?? 0).getTime())
      .slice(0, 6);
  }, [contents]);

  const onCreated = (created: ContentItem) => {
    fetchAll();
    setCreateOpen(false);
  };

  // helper to get category name from content item
  const getCategoryName = (item: ContentItem) => {
    const cid = (item as any).categoryId ?? item.categoryId ?? null;
    if (!cid) return null;
    if (typeof cid === "object") return (cid as any).name ?? null;
    const found = categories.find((c) => String(c._id) === String(cid));
    return found?.name ?? null;
  };

  // embed helper (same behaviours as ContentList)
  const renderEmbed = (item: ContentItem) => {
    const url = (item as any).link ?? (item as any).url ?? "";
    const type = (item.type ?? "link").toLowerCase();
    const title = item.title ?? "";

    // NOTE: for note we render description
    if (type === "note") {
      if (!item.description) return <p className="text-gray-400 italic">No description</p>;
      return <div className="bg-[#0b0b0b] p-3 rounded whitespace-pre-wrap text-sm text-gray-200">{item.description}</div>;
    }

    if (!url) return null;

    if (type === "youtube") {
      const videoId = url.includes("v=") ? url.split("v=")[1]?.split("&")[0] : url.split("/").pop();
      if (!videoId) return <a href={url} target="_blank" rel="noreferrer" className="text-purple-300 underline">{url}</a>;
      return (
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            frameBorder={0}
          />
        </div>
      );
    }

    if (type === "tweet") {
      return <Embed url={url} type="tweet" title={title} />;
    }

    if (type === "spotify") {
      const match = url.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
      if (!match) return <a href={url} target="_blank" rel="noreferrer" className="text-purple-300 underline">{url}</a>;
      const [, contentType, contentId] = match;
      return (
        <iframe
          src={`https://open.spotify.com/embed/${contentType}/${contentId}`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="encrypted-media"
          className="rounded"
        />
      );
    }

    if (type === "instagram") {
      return <Embed url={url} type="instagram" title={title} />;
    }

    if (type === "image") {
      return <img src={url} alt={title || "image"} className="w-full rounded object-cover max-h-56" />;
    }

    // fallback
    return <a href={url} target="_blank" rel="noreferrer" className="text-purple-300 underline break-all">{url}</a>;
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-400">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Content
          </button>
        </div>
      </div>

      {/* stats */}
      <section className="fade-in">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Stats</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.keys(stats).length === 0 ? (
            <div className="col-span-full text-center py-6 bg-[#0b0b0b] rounded-lg border border-neutral-800 text-gray-400">
              No items yet. Add some content to see stats.
            </div>
          ) : (
            Object.entries(stats).map(([type, count]) => (
              <div
                key={type}
                role="button"
                onClick={() => navigate(`/my?type=${encodeURIComponent(type)}`)}
                className="cursor-pointer bg-gradient-to-br from-neutral-900/40 to-neutral-800/20 border border-neutral-800 rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] transition hover-glow-dark"
              >
                <div className="text-sm text-gray-400 capitalize">{type}</div>
                <div className="text-2xl font-bold text-purple-300">{count}</div>
                <div className="mt-2 text-xs text-gray-500">Click to view</div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* recent */}
      <section className="fade-in">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Recently added</h2>

        {recent.length === 0 ? (
          <div className="text-center py-6 bg-[#0b0b0b] rounded-lg border border-neutral-800 text-gray-400">
            No recent content — add your first item.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((item) => {
              const catName = getCategoryName(item);
              return (
                <article
                  key={item._id}
                  onClick={() => navigate(`/my?type=${encodeURIComponent(item.type ?? "")}&highlight=${encodeURIComponent(item._id)}`)}
                  role="button"
                  className="cursor-pointer bg-[#0f0f0f] border border-neutral-800 rounded-xl overflow-hidden hover:bg-[#121212] transition hover-glow-dark"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.title || (item as any).link || "Untitled"}</h3>
                        <div className="text-xs text-gray-400 mt-1">
                          {item.type ?? "other"} • {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—" }
                        </div>
                        {catName && <div className="text-xs text-gray-400 mt-2">Category: {catName}</div>}
                        {Array.isArray(item.tags) && item.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.tags.map((t: any, i: number) => (
                              <span key={i} className="text-xs bg-neutral-800 px-2 py-1 rounded text-gray-300">
                                {typeof t === "string" ? t : t?.title ?? ""}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* embed preview */}
                    <div className="mt-4 fade-in">
                      {renderEmbed(item)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* categories */}
      <section className="fade-in">
        <h2 className="text-lg font-semibold text-gray-200 mb-4">Categories</h2>

        {categories.length === 0 ? (
          <div className="text-center py-6 bg-[#0b0b0b] rounded-lg border border-neutral-800 text-gray-400">
            No categories yet. Create one to organize your items.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const count = contents.filter((c) => {
                const cid = (c as any).categoryId ?? c.categoryId ?? null;
                const idStr = typeof cid === "object" ? (cid as any)._id ?? (cid as any).id ?? "" : String(cid ?? "");
                return String(idStr) === String(cat._id);
              }).length;

              return (
                <div
                  key={cat._id}
                  onClick={() => navigate(`/categories/${cat._id}`)}
                  role="button"
                  className="cursor-pointer bg-[#0f0f0f] border border-neutral-800 rounded-xl p-4 hover:bg-[#121212] transition hover-glow-dark"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-medium text-white">{cat.name}</div>
                    <div className="text-sm text-gray-400">{count}</div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">Click to open category</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <CreateContentModal open={createOpen} categories={categories} onClose={() => setCreateOpen(false)} onCreated={onCreated} />
    </div>
  );
}
