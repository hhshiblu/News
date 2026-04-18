"use client";

import { useRef, useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";

/** Single image: preview + click anywhere to replace. Full width on small screens; compact cap on md+. */
export default function ImageUploadPreview({
  file,
  onFileChange,
  existingUrl = null,
  disabled = false,
  emptyTitle = "Click to upload image",
  emptyHint = "JPG, PNG or WebP · max 1 file",
  previewHint = "Click to change image",
  /** When true, stays full width on all breakpoints (e.g. category modal). */
  fullWidth = false,
}) {
  const inputRef = useRef(null);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setBlobUrl(null);
      return undefined;
    }
    const u = URL.createObjectURL(file);
    setBlobUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const displayUrl = blobUrl || existingUrl || null;

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const widthCls = fullWidth ? "w-full max-w-full" : "w-full max-w-full md:max-w-[260px]";

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPicker();
        }
      }}
      className={`relative block min-h-[150px] overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:opacity-50 cursor-pointer md:min-h-[132px] ${widthCls}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
          e.target.value = "";
        }}
      />
      {displayUrl ? (
        <>
          <div className="flex h-48 items-center justify-center bg-white p-2 md:h-36 md:p-1.5">
            <img src={displayUrl} alt="" className="max-h-44 max-w-full object-contain md:max-h-[7.5rem]" />
          </div>
          <p className="border-t border-gray-200 bg-gray-50 py-2 text-center text-[11px] font-medium text-gray-600">{previewHint}</p>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center md:py-7">
          <ImagePlus className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-[13px] font-semibold text-gray-800">{emptyTitle}</p>
          <p className="mt-1 text-[11px] text-gray-500">{emptyHint}</p>
        </div>
      )}
    </div>
  );
}
