"use client";

import { Phone, MapPin, Leaf, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import StarRating from "@/components/StarRating";

export default function MessDetailsClient({ mess }: any) {
  const { isSignedIn, user } = useUser();

  // ⭐ RATING-ONLY STATE (NEW)
  const [localRating, setLocalRating] = useState(mess.rating);
  const [hasRated, setHasRated] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  // ⭐ RATING HANDLER (UPDATED)
  const handleRate = async (messId: string, value: number) => {
    if (!isSignedIn) return;
    if (hasRated || ratingLoading) return;

    setRatingLoading(true);

    // ⚡ OPTIMISTIC UI (instant)
    setLocalRating((prev: any) => {
      if (!prev) return { average: value, count: 1 };

      const newCount = prev.count + 1;
      const newAverage =
        (prev.average * prev.count + value) / newCount;

      return {
        average: Number(newAverage.toFixed(1)),
        count: newCount,
      };
    });

    setHasRated(true);

    try {
      const res = await fetch(`/api/owner/${messId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });

      if (!res.ok) {
        console.error("Rating API failed:", res.status);
      }
    } catch (error) {
      console.error("Rating error:", error);
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="pb-24">
      {/* BANNER */}
      <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-b-3xl shadow-xl">
        <img
          src={mess.imageUrl || "https://dummyimage.com/1200x600"}
          className="w-full h-full object-cover scale-105 animate-[fadeIn_1.2s_ease]"
        />
      </div>

      {/* DETAILS CARD */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white backdrop-blur-xl border border-slate-300/80 p-6 rounded-2xl shadow-2xl">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold main-dark">{mess.name}</h1>
              <p className="mt-2 main-second-dark">{mess.description}</p>

              {/* ⭐ RATING (ONLY CHANGE HERE) */}
              <div className="mt-3">
                <StarRating
                  rating={localRating?.average}
                  count={localRating?.count}
                  editable={isSignedIn && !hasRated}
                  onRate={(value) => handleRate(mess._id, value)}
                />

                {hasRated && (
                  <p className="text-sm text-green-600 mt-1">
                    ✅ You have rated this mess
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-3 text-slate-500 text-sm">
                <MapPin size={18} className="text-emerald-400" />
                {mess.address}
              </div>
            </div>

            <div className="bg-emerald-500 border border-emerald-400/40 sm:px-4 sm:py-1 rounded-xl text-md sm:text-lg font-semibold py-0 px-4">
              ₹{mess.chargesPerMonth}
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
              <span className="flex items-center gap-1 bg-orange-500/50 text-black px-3 py-1 rounded-full text-sm border">
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
                <Phone size={18} /> Call
              </a>
            </SignedIn>

            <SignedOut>
              <a
                href={`tel:${mess.mobileNumber}`}
                className="bg-emerald-500 hover:bg-emerald-400 px-6 py-3 rounded-xl text-black font-semibold flex items-center gap-2"
              >
                <Phone size={18} /> Call Now
              </a>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="max-w-4xl mx-auto px-4 mt-10 relative">
        <iframe
          width="100%"
          height="300"
          className="rounded-xl border border-slate-300/80 shadow-lg"
          src={`https://maps.google.com/maps?q=${mess.location.coordinates[1]},${mess.location.coordinates[0]}&z=15&output=embed`}
        />
      </div>
    </div>
  );
}
