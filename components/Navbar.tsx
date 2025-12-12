"use client";

import { useState } from "react";
import { UtensilsCrossed, MapPin, RefreshCcw, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import useUserLocation from "@/app/hooks/useUserLocation";
import Link from "next/link";

const Navbar = () => {
  const { locationText, permissionDenied, detectLocation } = useUserLocation();
  const [open, setOpen] = useState(false);
   const { user } = useUser();


  return (
    <header className="border-b border-slate-800/60 backdrop-blur sticky top-0 z-30 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href={'/'}>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-lime-300 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <UtensilsCrossed className="h-5 w-5 text-slate-950" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight text-base text-white">
              Nearby<span className="text-emerald-400">Mess</span>
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-[0.18em]">
              Student Mess Finder
            </span>
          </div>
        </div>
        </Link>

       {/* DESKTOP AUTH BUTTONS */}
<div className="hidden sm:flex items-center gap-3 text-white">
  <SignedOut>
    <SignInButton/>
    <SignUpButton>
      <button className="bg-[#6c47ff] text-white rounded-full font-medium h-10 px-4 text-sm">
        Sign Up
      </button>
    </SignUpButton>
  </SignedOut>

  <SignedIn>
    <a
      href="/become-owner"
      className="bg-emerald-500 text-black rounded-full font-medium h-10 px-4 text-sm flex items-center hover:bg-emerald-400 transition"
    >
      Become Owner
    </a>
      <a
      href="/your-mess"
      className="bg-emerald-500 text-black rounded-full font-medium h-10 px-4 text-sm flex items-center hover:bg-emerald-400 transition"
    >
      Your Mess
    </a>

    <UserButton />
  </SignedIn>
</div>


        {/* MOBILE HAMBURGER BUTTON */}
        {}
        <div className="flex gap-2 sm:hidden block">
            <UserButton />
        <button
          className="sm:hidden text-slate-200"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} />  : <Menu size={26} />}
           
        </button>
         </div>
      </div>

      {/* MOBILE COLLAPSE MENU */}
      {open && (
        <div className="sm:hidden bg-slate-900/80 border-t border-slate-800/60 px-4 py-4 space-y-4">

          {/* LOCATION ROW (only mobile menu) */}
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <MapPin size={16} className="text-blue-500 shrink-0" />
            <span className="truncate">{locationText}</span>

            <button
              onClick={detectLocation}
              className="flex items-center gap-1 text-gray-500 hover:text-emerald-400 text-xs"
            >
              <RefreshCcw size={12} /> Refresh
            </button>
          </div>

          {/* LOCATION PERMISSION BUTTON */}
          {permissionDenied && (
            <button
              onClick={detectLocation}
              className="bg-blue-600 text-white rounded px-3 py-2 text-sm w-fit"
            >
              Allow Location
            </button>
          )}

          {/* AUTH ACTIONS */}
          <div className="pt-2 border-t border-slate-800/60">
            <SignedOut>
              <div className="flex flex-col gap-3 mt-3">
                <SignInButton>
                  <button className="w-full bg-slate-800 text-slate-200 py-2 rounded-lg">
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton>
                  <button className="w-full bg-emerald-500 text-black py-2 rounded-lg">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
 <div>
  
 </div>
            <SignedIn>
              {/* <div className="text-center">
                 <UserButton />
              </div> */}
             
              <SignedIn>
  <div className="flex flex-col gap-3 mt-3 justify-center items-center">
    <a
      href="/become-owner"
      className="w-full bg-emerald-500 text-black py-2 rounded-lg font-medium text-sm text-center hover:bg-emerald-400 transition"
    >
      Become Owner
    </a>
    <a
      href="/your-mess"
      className="w-full bg-emerald-500 text-black py-2 rounded-lg font-medium text-sm text-center hover:bg-emerald-400 transition"
    >
      Your Mess
    </a>

  </div>
</SignedIn>

            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
