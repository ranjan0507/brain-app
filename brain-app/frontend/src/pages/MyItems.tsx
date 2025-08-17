// src/pages/MyContentPage.tsx
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ContentList from "../components/ContentList";
import LinkShareModal from "../components/LinkSharingModal";
import CreateContentModal from "../components/CreateContentModal";
import type { ContentItem, Category } from "../types";

export default function MyContentPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState(""); // title/desc search
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<ContentItem["type"] | "all">(
    "all"
  );
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // fetch categories & contents
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, contRes] = await Promise.all([
        api.get("/api/category"),
        api.get("/api/content"),
      ]);
      const cats = Array.isArray(cRes.data)
        ? cRes.data
        : cRes.data?.categories ?? [];
      const conts = Array.isArray(contRes.data)
        ? contRes.data
        : contRes.data?.contents ?? [];
      setCategories(cats);
      setContents(conts);
    } catch (err) {
      console.error("fetchAll error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // derive tags from all content
  const availableTags = useMemo(() => {
    const s = new Set<string>();
    for (const c of contents) {
      if (!c.tags) continue;
      for (const t of c.tags as (string | { title: string })[]) {
        const tagTitle = typeof t === "string" ? t : t?.title ?? "";
        if (tagTitle) s.add(tagTitle.trim());
      }
    }
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [contents]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQ("");
    setSelectedCategory("");
    setSelectedTags([]);
    setSelectedType("all");
  };

  // filtered contents
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();

    return contents.filter((item) => {
      // 🔍 Title/description match
      const titleMatch =
        qLower === "" ||
        (item.title ?? "").toLowerCase().includes(qLower) ||
        (item.description ?? "").toLowerCase().includes(qLower);

      // Category match
      const catIdOrObj: any = (item as any).categoryId ?? null;
      const itemCategoryId =
        typeof catIdOrObj === "object"
          ? catIdOrObj._id ?? catIdOrObj.id
          : catIdOrObj;
      const categoryMatch =
        !selectedCategory || String(itemCategoryId) === String(selectedCategory);

      // Tags match (require ALL selected tags)
      let itemTags: string[] = [];
      if (Array.isArray(item.tags)) {
        itemTags = item.tags
          .map((t: string | { title: string }) =>
            typeof t === "string" ? t : t?.title ?? ""
          )
          .filter(Boolean);
      }
      const itemTagsLower = itemTags.map((t) => t.toLowerCase());
      const tagsMatch =
        selectedTags.length === 0 ||
        selectedTags.every((sel) => itemTagsLower.includes(sel.toLowerCase()));

      // Type match
      const typeMatch =
        selectedType === "all" || item.type === selectedType;

      return titleMatch && categoryMatch && tagsMatch && typeMatch;
    });
  }, [contents, q, selectedCategory, selectedTags, selectedType]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/api/content/${id}`);
      setContents((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Failed to delete");
    }
  };

  const handleEdit = async (id: string) => {
    const newTitle = prompt("New title:");
    if (!newTitle) return;
    try {
      const res = await api.patch(`/api/content/${id}`, { title: newTitle });
      const updated = res.data?.content ?? res.data;
      setContents((prev) => prev.map((c) => (c._id === id ? updated : c)));
    } catch (err) {
      console.error("edit error:", err);
      alert("Failed to update");
    }
  };

  const handleShare = async (id: string) => {
    try {
      // request backend for a link specific to this content
      const res = await api.post("/api/links", { contentId: id });
      const url =
        res.data?.link?.url ?? res.data?.link ?? res.data?.url ?? null;
      setShareLink(url);
      setShareOpen(true);
    } catch (err) {
      console.error("share error:", err);
      alert("Failed to generate link");
    }
  };

  const onCreated = (created: ContentItem) => {
    fetchAll(); // refresh to populate tags & categories
    setCreateOpen(false);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <header className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-purple-400">My Content</h1>
            <p className="text-sm text-gray-400 mt-1">
              Search by title, description, category, tags or type.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* 🔍 Title/desc search */}
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="bg-[#0f0f0f] p-2 rounded border border-neutral-800"
            />

            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0f0f0f] p-2 rounded border border-neutral-800"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Type dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="bg-[#0f0f0f] p-2 rounded border border-neutral-800"
            >
              <option value="all">All types</option>
              <option value="youtube">YouTube</option>
              <option value="tweet">Tweet</option>
              <option value="spotify">Spotify</option>
              <option value="instagram">Instagram</option>
              <option value="link">Link</option>
              <option value="image">Image</option>
              <option value="note">Note</option>
            </select>

            {/* Tag chips */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block text-sm text-gray-400 mr-2">
                Tags:
              </div>
              <div className="flex gap-2 flex-wrap max-w-xs">
                {availableTags.length === 0 ? (
                  <div className="text-xs text-gray-500">No tags</div>
                ) : (
                  availableTags.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2 py-1 rounded ${
                          active
                            ? "bg-purple-600 text-white"
                            : "bg-neutral-800 text-gray-300"
                        }`}
                        title={`Filter by tag "${tag}"`}
                      >
                        {tag}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>

            <button
              onClick={() => setCreateOpen(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
            >
              Add Content
            </button>
          </div>
        </div>
      </header>

      {/* content list with embeds */}
      <ContentList
        contents={filtered}
        categories={categories}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onShare={handleShare}
      />

      {/* modals */}
      <LinkShareModal
        open={shareOpen}
        link={shareLink}
        onClose={() => setShareOpen(false)}
      />

      <CreateContentModal
        open={createOpen}
        categories={categories}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
    </div>
  );
}
