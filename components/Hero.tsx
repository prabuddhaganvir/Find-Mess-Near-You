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
import Link from "next/link";
import { Soup } from "lucide-react";


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
      <section className="relative w-full py-24 px-4 sm:px-6 flex flex-col items-center text-center  ">

        {/* PREMIUM Gradient Background */}
 
       
          

        {/* Animated Map Glow */}
        <div
          className={`absolute top-32 left-1/2 -translate-x-1/2 h-80 w-80 blur-[140px] rounded-full -z-10 transition-all duration-700
            ${coords.lat ? "bg-emerald-500/40 opacity-60 scale-110" : "bg-red-500/20 opacity-30 animate-pulse"}
          `}
        />

        <Badge className="main-bg-orange border main-text-orange px-4 py-1 mb-8">
          New • Discover verified mess near you
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-semibold text-slate-900 max-w-4xl">
          Find <span className="text-[#F08700] font-bold">Trusted Mess</span> near your hostel
        </h1>

        <p className="main-second-dark mt-6 max-w-2xl text-lg">
          Explore clean, affordable and reliable mess options around you.
        </p>

        {/* Search bar */}
      <div className="mt-10 w-full max-w-3xl mx-auto space-y-4">

  {/* Location Input */}
  <div className="relative w-full">
    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />

    <Input
      className="pl-12 py-6 border border-slate-400/70 rounded-xl w-full main-dark"
      value={locationText}
      readOnly
    />
  </div>

  {/* Permission Denied → Retry */}
  {permissionDenied && (
    <div className="flex flex-col sm:flex-row sm:tems-start sm:items-center justify-between gap-3 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
      
      <p className="text-red-400 text-sm">
        Location permission denied. Please enable location access.
      </p>

      <Button
        onClick={detectLocation}
        className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center gap-2 "
      >
        <RefreshCcw size={16} />
        Retry
      </Button>
    </div>
  )}

      </div>


        {/* Stats */}
        <div className="flex flex-wrap gap-10 mt-12 main-second-dark text-sm">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-emerald-500/70 rounded-full" />
              <div className="w-8 h-8 bg-indigo-500/70 rounded-full" />
              <div className="w-8 h-8 bg-pink-500/70 rounded-full" />
            </div>
            10,000+ searches
          </div>

          <div className="flex items-center main-second-dark gap-2">
            <Star className="text-amber-400 fill-amber-400" /> 4.9 rating
          </div>
        </div>
      </section>


      {/* ⭐ NEARBY MESS SECTION */}
      <section className="px-4 sm:px-6 py-12 max-w-6xl mx-auto space-y-6 ">

        <div className="flex items-center gap-2">
          <p className="main-dark text-3xl font-bold">Mess Available Near You</p>
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


    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 "  >
      {mess.map((m) => (
        <Link
      key={m._id}
      href={`/mess/${m._id}`}
      prefetch
      className="block"
    >
        <div
        
          key={m._id}
          className="border relative border-gray-300/60 rounded-2xl shadow hover:shadow-xl hover:cursor-ointer hover:scale-[1.02] transition-all"
        onClick={() => router.push(`/mess/${m._id}`)}>
     {/* ⭐ Distance Badge */}
{coords.lat && coords.lng && (() => {
  const distanceKm = getDistanceKm(
    coords.lat,
    coords.lng,
    m.location.coordinates[1],
    m.location.coordinates[0]
  );

  return (
    <span className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
      {distanceKm < 1
        ? `${Math.round(distanceKm * 1000)} m`
        : `${distanceKm.toFixed(1)} km`}
    </span>
  );
})()}
          <div className="w-full h-40 rounded-t-2xl overflow-hidden">
            <img src={m.imageUrl} className="w-full h-full object-cover" />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold main-dark">{m.name}</h3>
        <p className="main-second-dark mt-2">
  {m.description?.length > 30
    ? m.description.slice(0, 30) + "..."
    : m.description}
</p>


            <div className="mt-3 main-dark font-semibold flex
            justify-between">
              ₹ {m.chargesPerMonth}
             <span className=" top-2 right-2 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">Full</span>
            </div>

            {/* <Button onClick={() => handleCall(m.mobileNumber)} className="mt-4 w-full bg-emerald-500 text-black rounded-xl hover:bg-emerald-600" > Call Now </Button>
             <Button onClick={() => router.push(`/mess/${m._id}`)} className="mt-2 w-full bg-slate-800 text-white rounded-xl hover:bg-slate-850" > View Details </Button> */}
          </div>
        </div>
          </Link>
      ))}
     
    </div>
    
  
  )}
     
      </section>


      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
