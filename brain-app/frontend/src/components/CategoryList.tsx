// src/components/CategoryList.tsx
import type { Category } from "../types";

export default function CategoryList({
  categories,
  onEdit,
  onDelete
}: {
  categories: Category[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  if (!categories.length) return <div className="text-gray-400">No categories yet.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <div key={cat._id} className="bg-[#0f0f0f] border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="text-lg font-semibold">{cat.name}</div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {onEdit && <button onClick={() => onEdit(cat._id)} className="text-sm text-purple-400">Rename</button>}
            {onDelete && <button onClick={() => onDelete(cat._id)} className="text-sm text-red-400">Delete</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
