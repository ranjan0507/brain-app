// src/components/LinkShareModal.tsx
import { useEffect, useState } from "react";

export default function LinkShareModal({ open, link, onClose }: {
  open: boolean;
  link: string | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open) return null;

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
      alert("Copy failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-[#0f0f0f] p-6 rounded w-full max-w-md border border-neutral-800">
        <h2 className="text-lg font-semibold mb-3 text-purple-400">Shareable link</h2>

        <input
          readOnly
          value={link ?? ""}
          className="w-full bg-neutral-900 p-2 rounded text-sm mb-4"
        />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button onClick={onClose} className="text-gray-400 px-3 py-1 rounded">Close</button>
            {link && (
              <a href={link} target="_blank" rel="noreferrer" className="text-sm px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700">
                Open
              </a>
            )}
          </div>
          <button onClick={handleCopy} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded">
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}
