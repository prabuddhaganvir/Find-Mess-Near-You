"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function CloudinaryUpload({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  return (
    <div className="w-full">
      <CldUploadWidget
        uploadPreset="mess_app"
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          sources: ["local", "camera", "url"],
          multiple: false,
          maxFiles: 1,
          folder: "mess_app",
          clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
        }}
        onQueuesEnd={(result: any) => {
          const url =
            result?.info?.files?.[0]?.uploadInfo?.secure_url ||
            result?.info?.secure_url;

          if (!url) return;

          // 🔥 AUTO COMPRESS (WORKS FOR ALL FORMATS)
          const optimizedUrl = url.replace(
            "/upload/",
            "/upload/f_auto,q_auto:eco,w_1200/"
          );

          onUpload(optimizedUrl);
        }}
        onError={(err) => console.error("❌ CLOUDINARY ERROR:", err)}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
            className="w-full bg-slate-800 border border-slate-700 text-white py-3 rounded-lg hover:bg-slate-700"
          >
            📤 Upload Image
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
