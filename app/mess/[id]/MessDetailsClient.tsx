"use client";

import { Phone, MapPin, Leaf, UtensilsCrossed, MessageCircle } from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import MessDetailsSkeleton from "./MessDetailsSkeleton";
import Navbar from "@/components/Navbar";

export default function MessDetailsClient({ mess }: any) {
  const { isSignedIn } = useUser();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="pb-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      <Navbar />

      {/* BANNER */}
      <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-b-3xl shadow-xl">
        <img
          src={mess.imageUrl || "https://dummyimage.com/1200x600"}
          className="w-full h-full object-cover scale-105 animate-[fadeIn_1.2s_ease]"
        />
      </div>

      {/* DETAILS CARD */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{mess.name}</h1>
              <p className="text-slate-400 mt-2">{mess.description}</p>

              <div className="flex items-center gap-2 mt-3 text-slate-300 text-sm">
                <MapPin size={18} className="text-emerald-400" />
                {mess.address}
              </div>
            </div>

            <div className="bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 px-4 py-2 rounded-xl text-lg font-semibold">
              ₹ {mess.chargesPerMonth}
            </div>
          </div>

          {/* FOOD TYPE */}
          <div className="mt-4 flex items-center gap-2">
            {mess.foodType === "veg" && (
              <span className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                <Leaf size={14} /> Veg
              </span>
            )}
            {mess.foodType === "nonveg" && (
              <span className="flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                <UtensilsCrossed size={14} /> Non-Veg
              </span>
            )}
            {mess.foodType === "both" && (
              <span className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                <UtensilsCrossed size={14} /> Veg + Non-Veg
              </span>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex items-center gap-4">

            <SignedIn>
              <a
                href={`tel:${mess.mobileNumber}`}
                className="bg-emerald-500 hover:bg-emerald-400 px-6 py-3 rounded-xl text-black font-semibold flex items-center gap-2"
              >
                <Phone size={18} /> Call Now
              </a>
            </SignedIn>

            <SignedOut>
              <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-xl text-sm">
                Login required to call owner.
              </div>
            </SignedOut>

          </div>
        </div>
      </div>

      {/* MAP WITH LOCK */}
      <div className="max-w-4xl mx-auto px-4 mt-10 relative">

        {!isSignedIn && (
          <div
            onClick={() => setShowLogin(true)}
            className="absolute inset-0 z-20 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl cursor-pointer"
          >
            <p className="text-white text-sm mb-2">Login to view location</p>
            <button className="px-4 py-2 bg-emerald-500 text-black rounded-lg font-semibold">
              Sign In
            </button>
          </div>
        )}

        <iframe
          width="100%"
          height="300"
          className={`rounded-xl border border-slate-800 shadow-lg ${
            !isSignedIn ? "blur-sm brightness-50 pointer-events-none" : ""
          }`}
          src={`https://maps.google.com/maps?q=${mess.location.coordinates[1]},${mess.location.coordinates[0]}&z=15&output=embed`}
        ></iframe>
      </div>
    </div>
  );
}
