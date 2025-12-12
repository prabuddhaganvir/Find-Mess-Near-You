"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function CloudinaryUpload({ onUpload }: { onUpload: (url: string) => void }) {
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
          console.log("📦 QUEUES-END RESULT:", result);

          const url =
            result?.info?.files?.[0]?.uploadInfo?.secure_url ||
            result?.info?.secure_url;

          if (url) {
            console.log("✅ FINAL URL:", url);
            onUpload(url);
          } else {
            console.warn("⚠️ No URL found in queue-end");
          }
        }}
        onError={(err) => console.error("❌ CLOUDINARY ERROR:", err)}
      >
        {({ open }) => (
          <button
            type="button"  // 🔥 SUPER IMPORTANT
            onClick={(e) => {
              e.preventDefault(); // Prevent form interactions
              console.log("📁 Opening Cloudinary Widget...");
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
