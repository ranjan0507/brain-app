// src/pages/AddContentPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateContentModal from "../components/CreateContentModal";
import api from "../services/api";
import type { Category, ContentItem } from "../types";

export default function AddContentPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/category");
        const data = Array.isArray(res.data) ? res.data : res.data?.categories ?? [];
        if (!cancelled) setCategories(data);
      } catch (err) {
        console.error("load categories:", err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onCreated = (created: ContentItem) => {
    // after create, go to My Content so user sees the new item
    navigate("/my");
  };

  // This page simply renders the create modal immediately
  return <CreateContentModal open={true} onClose={() => navigate(-1)} categories={categories} onCreated={onCreated} />;
}
