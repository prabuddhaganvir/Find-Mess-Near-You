"use client";

import { SignIn } from "@clerk/nextjs";
import { X } from "lucide-react";

export default function LoginModal({ open, onClose }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-slate-900 rounded-2xl p-6 relative shadow-xl min-w-[350px]">

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-slate-400 hover:text-white"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* ⭐ Clerk Sign-In with HASH routing fix */}
        <SignIn
          routing="hash"
          appearance={{
            elements: {
              card: "bg-slate-900 text-white",
              headerTitle: "text-white",
            }
          }}
        />
      </div>
    </div>
  );
}
