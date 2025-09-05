// src/components/CategoryList.tsx
import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "../types";

type CategoryListProps = {
  categories: Category[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onOpen?: (id: string) => void;
};

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  onOpen,
}: CategoryListProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8 bg-[#0b0b0b] rounded-lg border border-neutral-800">
        No categories yet — create one to organize your content.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="group relative bg-[#0f0f0f] border border-neutral-800 rounded-xl p-4 cursor-pointer hover:bg-[#121212] transition"
          onClick={() => onOpen?.(String(cat._id))}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold text-white">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-1">Category</div>
            </div>

            <div
              className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
              onClick={(e) => e.stopPropagation()}
            >
              {onEdit && (
                <button
                  onClick={() => onEdit(cat._id)}
                  title="Rename"
                  className="p-1 rounded hover:bg-neutral-800"
                >
                  <Pencil className="w-4 h-4 text-gray-300" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(cat._id)}
                  title="Delete"
                  className="p-1 rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
