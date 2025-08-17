// src/components/ContentList.tsx
import type { ContentItem, Category } from "../types";
import Embed from "./Embed";

interface Props {
  contents: ContentItem[];
  categories: Category[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onShare: (id: string) => void;
}

export default function ContentList({
  contents,
  categories,
  onDelete,
  onEdit,
  onShare,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contents.map((item) => {
        // category name lookup
        let categoryName = "";
        if (item.categoryId) {
          if (typeof item.categoryId === "object") {
            categoryName = (item.categoryId as any).name ?? "";
          } else {
            const cat = categories.find((c) => c._id === item.categoryId);
            categoryName = cat?.name ?? "";
          }
        }

        // normalize tags
        const tags =
          Array.isArray(item.tags) &&
          item.tags.map((t: string | { title: string }) =>
            typeof t === "string" ? t : t?.title ?? ""
          );

        return (
          <div
            key={item._id}
            className="bg-[#111] p-4 rounded-lg border border-neutral-800"
          >
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            {categoryName && (
              <p className="text-sm text-gray-400">Category: {categoryName}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.isArray(tags) &&
                tags.map((t, i) => (
                  <span
                    key={i}
                    className="bg-neutral-800 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    #{t}
                  </span>
                ))}
            </div>

            <div className="mt-3">
              <Embed
                url={item.url}
                type={item.type}
                description={item.description}
                title={item.title}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-3 text-sm">
              <button
                onClick={() => onEdit(item._id)}
                className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item._id)}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={() => onShare(item._id)}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded"
              >
                Share
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
