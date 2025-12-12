"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Trash2, Loader2, Loader } from "lucide-react";

export default function YourMessPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [mess, setMess] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // ⭐ Redirect if NOT logged in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn]);

 useEffect(() => {
  if (!user?.id) return;

  const loadMess = async () => {
    try {
      // 1️⃣ Check if owner has a mess
      const res = await fetch("/api/mess/check-owner");
      const data = await res.json();
      console.log(data)

      if (!data.exists) {
        setMess(null);
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch that mess details
     const res2 = await fetch(`/api/mess/${data.messId}`);
      const messData = await res2.json();

      setMess(messData);
    } catch (e) {
      console.error("Error loading mess:", e);
    }

    setLoading(false);
  };

  loadMess();
}, [user?.id]);


  // ⭐ Delete Mess Function
  const handleDelete = async () => {
    if (!mess?._id) return;

    if (!confirm("Are you sure? This will permanently delete your mess.")) {
      return;
    }

    setDeleting(true);

    const res = await fetch(`/api/mess/${mess._id}`, {
      method: "DELETE",
    });

    setDeleting(false);

    if (res.ok) {
      toast.success("Mess deleted successfully!");
      router.push("/");
    } else {
      toast.error("Failed to delete mess.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300 bg-black flex-col">
         <p>
            <Loader size={30} className="animate-spin" />
          </p>
         <p className="text-md"> 
           Loading your mess...
          </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-8">Your Mess</h1>

        {/* If owner has no mess */}
        {!mess && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-400 text-lg">
              You have not created any mess yet.
            </p>

            <button
              onClick={() => router.push("/become-owner")}
              className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-semibold"
            >
              Create Mess
            </button>
          </div>
        )}

        {/* If mess exists */}
        {mess && (
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl shadow-xl">

            <img
              src={mess.imageUrl}
              className="w-full h-52 object-cover rounded-xl mb-4 border border-slate-800"
            />

            <h2 className="text-2xl font-semibold text-white">{mess.name}</h2>

            <p className="text-slate-400 mt-2">{mess.description}</p>

            <div className="mt-4 text-slate-300 space-y-1">
              <p>📍 {mess.address}</p>
              <p>₹ {mess.chargesPerMonth} / month</p>
              <p>📞 {mess.mobileNumber}</p>
              <p className="capitalize">🍽️ {mess.foodType}</p>
            </div>

            <div className="mt-6 flex gap-4">

              {/* Edit Button */}
              <button
                onClick={() => router.push(`/owner/mess/${mess._id}/edit`)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Edit size={18} /> Edit
              </button>

              {/* Delete */}
              <button
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 bg-red-500/80 hover:bg-red-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
