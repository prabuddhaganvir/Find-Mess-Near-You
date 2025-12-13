"use client";

import useUserLocation from "@/app/hooks/useUserLocation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";


// ⭐ Skeleton Loader Component
function MessSkeleton() {
  return (
    <div className="animate-pulse border border-slate-800 bg-slate-900/40 backdrop-blur-xl rounded-2xl p-5">
      <div className="w-full h-40 bg-slate-800/50 rounded-xl"></div>

      <div className="mt-4 h-4 bg-slate-800/50 rounded w-3/4"></div>
      <div className="mt-2 h-3 bg-slate-800/50 rounded w-1/2"></div>

      <div className="mt-4 h-4 bg-slate-800/50 rounded w-1/4"></div>
      <div className="mt-2 h-3 bg-slate-800/50 rounded w-full"></div>

      <div className="mt-6 h-8 bg-slate-800/50 rounded-xl"></div>
    </div>
  );
}


// ⭐ Mess type
interface MessType {
  _id: string;
  name: string;
  description: string;
  chargesPerMonth: number;
  address: string;
  distance: number;
  imageUrl: string;
  mobileNumber: number;
  location: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}
// Haversine formula
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return +(R * c).toFixed(1); // return distance in KM (1 decimal)
}


// ⭐ MAIN COMPONENT
export default function Hero() {
  const { coords, locationText, permissionDenied, detectLocation } = useUserLocation();
  const [mess, setMess] = useState<MessType[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { isSignedIn } = useUser();
  const [showLogin, setShowLogin] = useState(false);

  // CALL NOW HANDLER
  const handleCall = (phone: number) => {
    // if (!isSignedIn) {
    //   setShowLogin(true);
    //   return;
    // }
    window.location.href = `tel:${phone}`;
  };

  // ⭐ Fetch nearby mess when EXACT location is ready
  useEffect(() => {
    if (!coords.lat || !coords.lng || locationText === "Detecting location...") return;

    const fetchMess = async () => {
      const res = await fetch(`/api/mess/getnearby?lat=${coords.lat}&lng=${coords.lng}`);
      const data = await res.json();
      setMess(data);
      setLoading(false);
    };

    fetchMess();
  }, [coords, locationText]);

  


  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full py-24 px-4 sm:px-6 flex flex-col items-center text-center">

        {/* PREMIUM Gradient Background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />

        {/* Animated Map Glow */}
        <div
          className={`absolute top-32 left-1/2 -translate-x-1/2 h-80 w-80 blur-[140px] rounded-full -z-10 transition-all duration-700
            ${coords.lat ? "bg-emerald-500/40 opacity-60 scale-110" : "bg-red-500/20 opacity-30 animate-pulse"}
          `}
        />

        <Badge className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-1 mb-8">
          New • Discover verified mess near you
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-semibold text-slate-100 max-w-4xl">
          Find <span className="text-emerald-400">trusted mess</span> near your hostel
        </h1>

        <p className="text-slate-300 mt-6 max-w-2xl text-lg">
          Explore clean, affordable and reliable mess options around you.
        </p>

        {/* Search bar */}
        <div className="mt-10 w-full max-w-xl flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <Input
              className="pl-11 py-6 bg-slate-900/60 border-slate-700/70 rounded-xl"
              value={locationText}
              readOnly
              
            />
          </div>


        {/* Permission Denied → Retry */}
        {permissionDenied && (
          <div className="text-center my-4">
            <p className="text-red-400 mb-3">Location permission denied.</p>

            <Button
              onClick={detectLocation}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              <RefreshCcw size={16} /> Retry Permission
            </Button>
          </div>
        )}


        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10 mt-12 text-slate-300 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-emerald-500/70 rounded-full" />
              <div className="w-8 h-8 bg-indigo-500/70 rounded-full" />
              <div className="w-8 h-8 bg-pink-500/70 rounded-full" />
            </div>
            10,000+ searches
          </div>

          <div className="flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" /> 4.9 rating
          </div>
        </div>
      </section>


      {/* ⭐ NEARBY MESS SECTION */}
      <section className="px-4 sm:px-6 py-12 max-w-6xl mx-auto space-y-6">

        <div className="flex items-center gap-2">
          <p className="text-slate-300 text-3xl font-bold">Mess Available Near You</p>
        </div>
         {/* ⭐ STILL DETECTING LOCATION → SHOW SKELETONS */}
  {locationText === "Detecting location..." && (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <MessSkeleton /><MessSkeleton /><MessSkeleton /><MessSkeleton />
    </div>
  )}

  {/* ⭐ LOCATION READY BUT DB STILL LOADING */}
  {coords.lat && coords.lng && locationText !== "Detecting location..." && loading && (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <MessSkeleton /><MessSkeleton /><MessSkeleton /><MessSkeleton />
    </div>
  )}

  {/* ⭐ NO MESS AVAILABLE */}
  {coords.lat && coords.lng && !loading && mess.length === 0 && (
    <p className="text-red-400 text-sm">No mess available near your location."</p>
  )}

  {/* ⭐ SHOW MESS CARDS */}
  {coords.lat && coords.lng && !loading && mess.length > 0 && (
    
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {mess.map((m) => (
        <div
          key={m._id}
          className="border relative border-slate-800 bg-slate-900/40 rounded-2xl shadow hover:shadow-xl hover:scale-[1.02] transition-all"
        >
     {/* ⭐ Distance Badge */}
  {coords.lat && coords.lng && (
    <span className="absolute top-2 right-2 bg-emerald-600 text-black px-3 py-1 rounded-full text-xs font-semibold shadow">
      {getDistanceKm(
        coords.lat,
        coords.lng,
        m.location.coordinates[1],
        m.location.coordinates[0]
      )}{" "}
      km away
    </span>
  )}
          <div className="w-full h-40 rounded-t-2xl overflow-hidden">
            <img src={m.imageUrl} className="w-full h-full object-cover" />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-100">{m.name}</h3>
            <p className="text-slate-400 text-sm mt-1">{m.description}</p>

            <div className="mt-3 text-slate-200 font-semibold flex
            justify-between">
              ₹ {m.chargesPerMonth}
             <span className="top-2 right-2 bg-emerald-600 text-black px-3 py-1 rounded-full text-xs font-semibold shadow"> Full</span>
            </div>

            <p className="text-slate-500 text-sm">📍 {m.address}</p>
            <Button onClick={() => handleCall(m.mobileNumber)} className="mt-4 w-full bg-emerald-500 text-black rounded-xl hover:bg-emerald-600" > Call Now </Button>
             <Button onClick={() => router.push(`/mess/${m._id}`)} className="mt-2 w-full bg-slate-800 text-white rounded-xl hover:bg-slate-850" > View Details </Button>
          </div>
        </div>
      ))}
    </div>
  )}
     
      </section>


      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
