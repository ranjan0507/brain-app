// src/components/ContentList.tsx
import React, { useState } from "react";
import type { ContentItem } from "../types";
import type { Category } from "../types";

function getLink(item: ContentItem) {
  // backend sometimes uses `link` or `url`
  return (item as any).link ?? item.url ?? "";
}

function youtubeEmbedUrl(url: string) {
  // extract YouTube video id and return embed url
  // supports: https://youtu.be/ID, https://www.youtube.com/watch?v=ID, /embed/ID
  try {
    const u = url.trim();
    if (!u) return null;
    // youtu.be short links
    const byShort = u.match(/youtu\.be\/([^?&/]+)/);
    if (byShort) return `https://www.youtube.com/embed/${byShort[1]}`;

    // v= query param
    const byV = u.match(/[?&]v=([^?&/]+)/);
    if (byV) return `https://www.youtube.com/embed/${byV[1]}`;

    // /embed/ID
    const byEmbed = u.match(/\/embed\/([^?&/]+)/);
    if (byEmbed) return `https://www.youtube.com/embed/${byEmbed[1]}`;

    // last path segment
    const lastSeg = u.split("/").filter(Boolean).pop();
    if (lastSeg && lastSeg.length === 11) return `https://www.youtube.com/embed/${lastSeg}`;

    return null;
  } catch {
    return null;
  }
}

export default function ContentList({
  contents,
  categories,
  onEdit,
  onDelete,
  onShare
}: {
  contents: ContentItem[];
  categories?: Category[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!contents || contents.length === 0) {
    return <div className="text-gray-400">No content yet.</div>;
  }

  const resolveCategoryName = (item: ContentItem) => {
    const cid = (item as any).categoryId;
    if (!cid) return null;
    if (typeof cid === "object") return cid.name ?? cid.title ?? null;
    if (typeof cid === "string" && Array.isArray(categories)) {
      return categories.find((c) => c._id === cid)?.name ?? null;
    }
    return null;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("copy failed", err);
      alert("Copy failed");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contents.map((item) => {
        const link = getLink(item);
        const embedType = (item.type ?? "other").toLowerCase();
        const ytEmbed = embedType === "youtube" ? youtubeEmbedUrl(link) : null;
        const isTweet = embedType === "tweet";
        const isImage = embedType === "image" && link;
        const catName = resolveCategoryName(item);

        return (
          <div key={item._id} className="bg-[#0f0f0f] border border-neutral-800 rounded-lg p-4 flex flex-col">
            <div className="flex-1">
              <div className="text-lg font-semibold mb-2">{item.title || link || "Untitled"}</div>

              {/* Embed area */}
              <div className="mb-3">
                {ytEmbed ? (
                  <div className="relative pb-[56.25%] h-0 overflow-hidden rounded">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={ytEmbed}
                      title={item.title || "YouTube video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : isTweet && link ? (
                  // use twitframe.com as a simple embed provider
                  <div className="rounded overflow-hidden">
                    <iframe
                      src={`https://twitframe.com/show?url=${encodeURIComponent(link)}`}
                      className="w-full h-64 border-none"
                      title="tweet embed"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  </div>
                ) : isImage ? (
                  <img src={link} alt={item.title ?? "image"} className="w-full max-h-64 object-cover rounded" />
                ) : link ? (
                  <a href={link} target="_blank" rel="noreferrer" className="text-sm text-purple-400 hover:underline">
                    {link}
                  </a>
                ) : (
                  <div className="text-sm text-gray-400">No link</div>
                )}
              </div>

              {/* meta */}
              <div className="text-xs text-gray-400 mb-2">
                {embedType} • {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
              </div>

              <div className="mb-3">
                {catName ? (
                  <div className="inline-block px-2 py-1 bg-neutral-900 text-sm rounded text-gray-300">Category: {catName}</div>
                ) : (
                  <div className="inline-block px-2 py-1 bg-neutral-900 text-sm rounded text-gray-500">Uncategorized</div>
                )}
              </div>

              {/* tags */}
              {item.tags && Array.isArray(item.tags) && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.tags.map((t: any) => (
                    <span key={typeof t === "string" ? t : t._id} className="text-xs bg-neutral-800 px-2 py-1 rounded">
                      {typeof t === "string" ? t : t.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* actions & visible link */}
            <div className="mt-4 flex flex-col gap-2">
              {/* Visible link + copy */}
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-gray-300 break-all">{link ? link : <span className="text-gray-500">No link</span>}</div>
                {link && (
                  <button
                    onClick={() => copyToClipboard(link, item._id)}
                    className="text-sm px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
                  >
                    {copiedId === item._id ? "Copied" : "Copy"}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-3">
                {onShare && (
                  <button onClick={() => onShare(item._id)} className="text-sm text-gray-300">
                    Generate Link
                  </button>
                )}
                {onEdit && <button onClick={() => onEdit(item._id)} className="text-sm text-purple-400">Edit</button>}
                {onDelete && <button onClick={() => onDelete(item._id)} className="text-sm text-red-400">Delete</button>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
