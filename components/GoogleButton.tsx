"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="w-full flex items-center justify-center gap-3 border px-4 py-2 rounded-lg hover:bg-gray-100"
    >
      <FcGoogle size={22} />
      Continue with Google
    </button>
  );
}
