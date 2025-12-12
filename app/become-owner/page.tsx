"use client";

import { useEffect, useState } from "react";
import {
  Leaf,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// ✅ Correct import (default import)
import CloudinaryUpload  from "../providers/CloudinaryProvider";



export default function BecomeOwner() {
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    chargesPerMonth: "",
    mobileNumber: "",
    imageUrl: "",
    foodType: "veg",
    address: "",
    lat: "",
    lng: "",
  });

  // ⭐ Prefill 
  
  
// ⭐ Prefill Email

useEffect(() => { if (user?.primaryEmailAddress?.emailAddress) { setForm((prev) => ({ ...prev, email: user.primaryEmailAddress!.emailAddress, })); } }, [user]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ⭐ Detect Location Automatically
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Device does not support location.");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setForm((prev) => ({
          ...prev,
          lat: String(lat),
          lng: String(lng),
        }));

        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
        const res = await fetch(url);
        const data = await res.json();

        setForm((prev) => ({
          ...prev,
          address: data.display_name || "",
        }));

        toast.success("Location detected!");
        setDetecting(false);
      },
      () => {
        toast.error("Please allow location access.");
        setDetecting(false);
      }
    );
  };


  // ⭐ Validate Form
  const validateForm = () => {
    if (!form.name || form.name.length < 3) return "Mess name must be at least 3 characters.";
    if (!form.description || form.description.length < 10)
      return "Description must be at least 10 characters.";
    if (!form.chargesPerMonth || +form.chargesPerMonth < 500)
      return "Monthly charge must be at least ₹500.";
    if (!form.mobileNumber || form.mobileNumber.length < 10)
      return "Enter a valid 10-digit mobile number.";
if (!form.imageUrl) return "Please upload an image.";
    if (!form.address) return "Address required.";
    if (!form.lat || !form.lng) return "Please detect your location.";

    return null;
  };

  // ⭐ Submit Handler
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const err = validateForm();
    if (err) return toast.error(err);

    setLoading(true);

    const res = await fetch("/api/mess/add", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        chargesPerMonth: Number(form.chargesPerMonth),
        mobileNumber: Number(form.mobileNumber),
        lat: Number(form.lat),
        lng: Number(form.lng),
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("🎉 Mess added successfully!");
      setTimeout(() => router.push("/"), 800);
    } else {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Become a Mess Owner</h1>
        <p className="text-slate-400 mt-3">
          Register your mess and start receiving student leads instantly.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 
        rounded-2xl shadow-xl p-8 space-y-6"
      >
        {/* Email (Pre-filled) */}
        <div>
          <label className="text-slate-300 text-sm">Your Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="mt-1 w-full bg-slate-800/50 border border-slate-700 text-slate-400 rounded-lg px-4 py-3 cursor-not-allowed"
          />
        </div>

        {/* Image Upload */}
      <CloudinaryUpload
  onUpload={(url) => {
    setForm((prev) => ({ ...prev, imageUrl: url }));
    setPreview(url);
    toast.success("Image uploaded!");
  }}
/>
        {preview && (
          <img
            src={preview}
            className="w-full h-48 rounded-xl object-cover mt-3 border border-slate-700"
          />
        )}

        {/* NAME */}
        <div>
          <label className="text-slate-300 text-sm">Mess Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Shree Dattatreya Mess"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-slate-300 text-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input-field h-24"
            placeholder="Simple homestyle meals, delivery available."
          />
        </div>

        {/* PRICE + MOBILE */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-300 text-sm">Monthly Charges</label>
            <input
              type="number"
              name="chargesPerMonth"
              value={form.chargesPerMonth}
              onChange={handleChange}
              className="input-field"
              placeholder="2600"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">Mobile Number</label>
            <input
              type="number"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              className="input-field"
              placeholder="9887766554"
            />
          </div>
        </div>

        {/* FOOD TYPE */}
        <div className="text-slate-300">
          <label className="text-sm">Food Type</label>

          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="foodType" value="veg" checked={form.foodType === "veg"} onChange={handleChange} />
              <Leaf size={16} className="text-green-400" /> Veg
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" name="foodType" value="nonveg" checked={form.foodType === "nonveg"} onChange={handleChange} />
              <UtensilsCrossed size={16} className="text-red-400" /> Non-Veg
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" name="foodType" value="both" checked={form.foodType === "both"} onChange={handleChange} />
              🍽️ Both
            </label>
          </div>
        </div>

        {/* LOCATION */}
        <button
          type="button"
          onClick={detectLocation}
          disabled={detecting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium"
        >
          {detecting ? "Detecting location..." : "📍 Detect My Location"}
        </button>

        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="input-field"
          placeholder="Address will auto-fill here"
        />

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-semibold shadow-lg"
        >
          {loading ? "Submitting..." : "Register Mess"}
        </button>
      </form>
    </div>
  );
}
