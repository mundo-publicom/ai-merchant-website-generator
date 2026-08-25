import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { imageToDataUrl } from "@/components/forms/imageToDataUrl";
import { createId } from "@/utils/id";

const MAX_FILES = 8;

export interface UploadedAsset {
  id: string;
  name: string;
  preview: string;
}

export interface AssetUploaderProps {
  uploads: UploadedAsset[];
  onChange: (uploads: UploadedAsset[]) => void;
  label?: string;
  multiple?: boolean;
  /** Square preview for logos, wide thumbnails for photos. */
  variant?: "logo" | "gallery";
  /** Called with a human-readable reason whenever a file is not accepted. */
  onReject?: (reason: string) => void;
}

export function AssetUploader({
  uploads,
  onChange,
  label = "Upload images",
  multiple = true,
  variant = "gallery",
  onReject,
}: AssetUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);

    const limit = multiple ? MAX_FILES : 1;
    const chosen = Array.from(files);
    const accepted: UploadedAsset[] = [];
    const rejected: string[] = [];

    for (const file of chosen.slice(0, limit)) {
      const preview = await imageToDataUrl(file);
      if (preview) accepted.push({ id: createId("asset"), name: file.name, preview });
      else rejected.push(file.name);
    }

    if (accepted.length) onChange(multiple ? [...uploads, ...accepted] : accepted);
    setBusy(false);
    // Clearing the input lets the same file be picked again after a removal.
    if (inputRef.current) inputRef.current.value = "";

    if (rejected.length) {
      onReject?.(
        rejected.length === 1
          ? `${rejected[0]} could not be read as an image.`
          : `${rejected.length} files could not be read as images.`,
      );
    } else if (chosen.length > limit) {
      onReject?.(`Only the first ${limit} images were added.`);
    }
  };

  return (
    <div className="space-y-3">
      {uploads.length ? (
        <ul className="flex flex-wrap gap-3">
          {uploads.map((asset) => (
            <li
              key={asset.id}
              className="group relative overflow-hidden rounded-xl border border-ink-200 bg-white"
            >
              <img
                src={asset.preview}
                alt={asset.name}
                className={
                  variant === "logo"
                    ? "size-28 object-contain p-3"
                    : "size-28 object-cover"
                }
              />
              <button
                type="button"
                onClick={() => onChange(uploads.filter((a) => a.id !== asset.id))}
                aria-label={`Remove ${asset.name}`}
                className="absolute right-1.5 top-1.5 rounded-lg bg-white/90 p-1.5 text-ink-500 shadow-soft transition-colors hover:text-red-600"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="sr-only"
        aria-label={label}
        onChange={(event) => void handleFiles(event.target.files)}
      />
      <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
        <ImagePlus className="size-4" />
        {busy ? "Processing…" : label}
      </Button>
      <p className="text-[13px] text-ink-400">
        Images stay in your browser - nothing is uploaded to a server.
      </p>
    </div>
  );
}
