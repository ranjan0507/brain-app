// src/components/CreateContentModal.tsx
import { useEffect, useState } from "react";
import api from "../services/api";
import type { Category, ContentItem } from "../types";

export default function CreateContentModal({
  open,
  onClose,
  onCreated,
  categories
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (created: ContentItem) => void;
  categories: Category[];
}) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("other");
  const [tags, setTags] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle("");
      setLink("");
      setType("other");
      setTags("");
      setCategoryId("");
      setNewCategoryName("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() && !link.trim()) {
      alert("Provide a title or a link.");
      return;
    }
    if (!categoryId && !newCategoryName.trim()) {
      alert("Select or create a category");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        title: title.trim() || undefined,
        link: link.trim() || undefined,
        type,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      };

      if (categoryId) payload.categoryId = categoryId;
      else payload.categoryName = newCategoryName.trim();

      const res = await api.post("/api/content", payload);
      // backend returns { content: ... } per your controller
      const created = res.data?.content ?? res.data;
      if (created) onCreated(created as ContentItem);
      else {
        // fallback: minimal object
        onCreated({
          _id: String(Date.now()),
          title: payload.title ?? payload.link,
          url: payload.link,
          type: payload.type,
          createdAt: new Date().toISOString()
        } as ContentItem);
      }
      onClose();
    } catch (err: any) {
      console.error("create content error:", err);
      alert(err?.response?.data?.message ?? "Failed to create content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#0f0f0f] rounded p-6 w-full max-w-2xl border border-neutral-800">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Create New Content</h3>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-gray-300">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-[#0b0b0b] rounded border border-neutral-800" placeholder="Optional if link provided" />
          </div>

          <div>
            <label className="text-sm text-gray-300">Link (optional)</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full p-2 bg-[#0b0b0b] rounded border border-neutral-800" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-300">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 bg-[#0b0b0b] rounded border border-neutral-800">
                <option value="tweet">tweet</option>
                <option value="youtube">youtube</option>
                <option value="image">image</option>
                <option value="note">note</option>
                <option value="other">other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300">Tags (comma separated)</label>
              <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tag1, tag2" className="w-full p-2 bg-[#0b0b0b] rounded border border-neutral-800" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Category</label>
            <div className="flex gap-2 items-center">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="flex-1 p-2 bg-[#0b0b0b] rounded border border-neutral-800">
                <option value="">-- Select category (or create new) --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="text-gray-400">or</span>
              <input placeholder="New category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="p-2 bg-[#0b0b0b] rounded border border-neutral-800" />
            </div>
            <p className="text-xs text-gray-500 mt-1">If you provide a new category name it will be created automatically.</p>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="text-gray-400 px-3 py-1 rounded">Cancel</button>
            <button type="submit" disabled={loading} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded">
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
