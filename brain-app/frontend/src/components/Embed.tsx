// src/components/Embed.tsx
import { useEffect, useRef } from "react";

interface EmbedProps {
  url?: string;
  type?: string;
  title?: string;
  description?: string;
}

export default function Embed({ url, type, title, description }: EmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Twitter
    if (type === "tweet" && (window as any).twttr?.widgets?.load) {
      (window as any).twttr.widgets.load(containerRef.current);
    }

    // Instagram
    if (type === "instagram" && (window as any).instgrm?.Embeds?.process) {
      (window as any).instgrm.Embeds.process();
    }
  }, [url, type]);

  if (type === "note") {
    if (!description)
      return <p className="text-gray-400 italic">No description</p>;
    return (
      <div className="bg-gray-800 p-3 rounded-lg whitespace-pre-wrap">
        {description}
      </div>
    );
  }

  if (!url) return null;

  if (type === "youtube") {
    const videoId = url.includes("v=")
      ? url.split("v=")[1]?.split("&")[0]
      : url.split("/").pop();
    if (!videoId) return <a href={url}>{url}</a>;

    return (
      <iframe
        width="100%"
        height="250"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title ?? "YouTube video"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg"
      ></iframe>
    );
  }

  if (type === "tweet") {
    return (
      <div ref={containerRef}>
        <blockquote className="twitter-tweet">
          <a href={url}></a>
        </blockquote>
      </div>
    );
  }

  if (type === "spotify") {
    const match = url.match(
      /spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/
    );
    if (!match) return <a href={url}>{url}</a>;
    const [, contentType, contentId] = match;
    return (
      <iframe
        src={`https://open.spotify.com/embed/${contentType}/${contentId}`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="encrypted-media"
        className="rounded-lg"
      ></iframe>
    );
  }

  if (type === "instagram") {
    return (
      <div ref={containerRef}>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ width: "100%" }}
        >
          <a href={url}></a>
        </blockquote>
      </div>
    );
  }

  if (type === "image") {
    return (
      <img src={url} alt={title ?? "image"} className="rounded-lg w-full" />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 underline"
    >
      {url}
    </a>
  );
}
