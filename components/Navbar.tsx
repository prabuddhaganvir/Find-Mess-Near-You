"use client";

import { useState } from "react";
import { UtensilsCrossed, MapPin, RefreshCcw, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import useUserLocation from "@/app/hooks/useUserLocation";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { locationText, permissionDenied, detectLocation } = useUserLocation();
  const [open, setOpen] = useState(false);
   const { user } = useUser();



  return (
    <header className="border-b border-slate-300/60 sm:border-slate-500/60 backdrop-blur sticky top-0 z-30 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href={'/'}>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-lime-300 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <UtensilsCrossed className="h-5 w-5 text-slate-950" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-semibold tracking-tight text-base text-slate-900">
              Nearby<span className="main-text-orange font-bold">Mess</span>
            </span>
            <span className="text-[11px] main-second-dark uppercase tracking-[0.18em]">
              Student Mess Finder
            </span>
          </div>
        </div>
        </Link>

       {/* DESKTOP AUTH BUTTONS */}
<div className="hidden sm:flex items-center gap-3 text-white">
  <SignedOut>
    <SignInButton>
      <Button className="main-bg-orange rounded-full font-medium h-10 px-4 text-sm">
        Sign In
      </Button>
    </SignInButton>
    <SignUpButton>
      <Button
      variant="secondary"
       className="main-bg-orange rounded-full font-medium h-10 px-4 text-sm">
        Sign Up
      </Button>
    </SignUpButton>
  </SignedOut>

  <SignedIn>
    <Link href="/become-owner">
    <Button
      className="rounded-xl font-medium h-10 px-4 text-sm flex items-center transition"
    >
      Become Owner
    </Button>
    </Link>

    <Link href="/your-mess">
    <Button variant="secondary"
      className="rounded-xl font-medium h-10 px-4 text-sm flex items-center transition" >
      Your Mess
    </Button>
    </Link>

    <UserButton />
  </SignedIn>
</div>


        {/* MOBILE HAMBURGER BUTTON */}
        {}
        <div className="flex gap-2 sm:hidden block">
            <UserButton />
        <button
          className="sm:hidden text-black"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} />  : <Menu size={26} />}
           
        </button>
         </div>
      </div>

      {/* MOBILE COLLAPSE MENU */}
      {open && (
        <div className="sm:hidden bg-gray-300 border-t border-black px-4 py-4 space-y-4 shadow-md">

          {/* LOCATION ROW (only mobile menu) */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-blue-500 shrink-0" />
            <span className="truncate">{locationText}</span>

            <Button
            variant="ghost"
              onClick={detectLocation}
              className="flex items-center gap-1 text-xs"
            >
              <RefreshCcw size={12} /> Refresh
            </Button>
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
                  <Button className="w-full  py-2 rounded-lg">
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button 
                  variant="secondary"
                  className="w-full py-2 rounded-lg">
                    Sign Up
                  </Button>
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
  <div className="flex gap-3 mt-3 justify-center items-center">
    
     <Link href="/become-owner">
    <Button
      className="rounded-xl font-medium h-10 px-4 text-sm flex items-center transition"
    >
      Become Owner
    </Button>
    </Link>
      <Link href="/your mess">
    <Button
    variant="secondary"
      className="rounded-xl font-medium h-10 px-4 text-sm flex items-center transition"
    >
      Your Mess
    </Button>
    </Link>

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
