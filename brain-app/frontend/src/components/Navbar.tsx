// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { LayoutGrid, Folder, Search, Settings, PlusCircle, Star, LogOut, Share2 } from "lucide-react";
import type { Category } from "../types";
import LinkShareModal from "./LinkSharingModal";

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/category");
        const data = Array.isArray(res.data) ? res.data : res.data?.categories ?? [];
        if (!cancelled) setCategories(data);
      } catch (err) {
        console.error("fetch categories:", err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const linkCls = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
      location.pathname === path ? "bg-neutral-800 text-purple-400" : "text-gray-300 hover:bg-neutral-800"
    }`;

  const handleShareBrain = async () => {
    try {
      // backend generateLink creates a user-level share link (no payload expected)
      const res = await api.post("/api/links", {});
      // expected shape: { link: { url, hash } }
      const url = res.data?.link?.url ?? res.data?.link ?? res.data?.url ?? null;
      setShareUrl(url);
      setShareOpen(true);
    } catch (err) {
      console.error("share brain error:", err);
      alert("Failed to generate share link");
    }
  };

  return (
    <>
      <nav className="w-64 bg-[#0f0f0f] border-r border-neutral-800 p-4 flex flex-col">
        <div className="text-2xl font-bold text-purple-400 mb-4">Brain App</div>

        <div className="space-y-1">
          <Link to="/" className={linkCls("/")}>
            <LayoutGrid className="w-5 h-5" />
            Dashboard
          </Link>

          <Link to="/my" className={linkCls("/my")}>
            <Folder className="w-5 h-5" />
            My Content
          </Link>

          <Link to="/categories" className={linkCls("/categories")}>
            <Search className="w-5 h-5" />
            Categories
          </Link>

          {/* AddContent: navigates to page that opens CreateContentModal */}
          <Link to="/add-content" className={linkCls("/add-content")}>
            <PlusCircle className="w-5 h-5" />
            Add Content
          </Link>


        </div>

        <div className="mt-6 border-t border-neutral-800 pt-4">
          <div className="text-xs text-gray-400 px-4 mb-2">Categories</div>
          <div className="space-y-1 max-h-48 overflow-y-auto px-1">
            {categories.length ? (
              categories.map((c) => (
                <Link
                  key={c._id}
                  to={`/categories/${c._id}`}
                  className="block px-3 py-1 rounded text-gray-300 hover:bg-purple-800 hover:text-white"
                >
                  {c.name}
                </Link>
              ))
            ) : (
              <div className="text-gray-500 px-3">No categories yet</div>
            )}
          </div>

          {/* Share whole brain button */}
          <button
            onClick={handleShareBrain}
            className="mt-6 w-full flex items-center gap-2 px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-gray-200"
            title="Generate shareable link for your whole Brain"
          >
            <Share2 className="w-4 h-4" />
            Share Brain
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/signin";
            }}
            className="mt-3 w-full text-left px-3 py-2 rounded hover:bg-red-700 text-red-400"
          >
            <LogOut className="inline w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </nav>

      <LinkShareModal open={shareOpen} link={shareUrl} onClose={() => setShareOpen(false)} />
    </>
  );
}
