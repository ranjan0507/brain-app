interface ImagePreviewProps {
  url: string;
}

export default function ImagePreview({ url }: ImagePreviewProps) {
  return (
    <img
      src={url}
      alt="Preview"
      className="w-full max-h-60 object-cover rounded-xl"
    />
  );
}
