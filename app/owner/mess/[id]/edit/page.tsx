"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Leaf, UtensilsCrossed, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function EditMessPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  console.log("🔵 PARAM ID:", id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    chargesPerMonth: "",
    mobileNumber: "",
    imageUrl: "",
    foodType: "veg",
    address: "",
    lat: "",
    lng: "",
  });

  // 🔥 Load Mess Details
  useEffect(() => {
    async function loadMess() {
      // console.log("📡 Fetching mess:", `/api/mess/${id}`);

      try {
        const res = await fetch(`/api/mess/${id}`);
        // console.log("📥 GET Status:", res.status);

        if (!res.ok) {
          toast.error("Mess not found");
          router.push("/");
          return;
        }

        const data = await res.json();
        // console.log("📌 GET RESPONSE DATA:", data);

        setForm({
          name: data.name,
          description: data.description,
          chargesPerMonth: String(data.chargesPerMonth),
          mobileNumber: String(data.mobileNumber),
          imageUrl: data.imageUrl,
          foodType: data.foodType,
          address: data.address,
          lat: String(data.location.coordinates[1]),
          lng: String(data.location.coordinates[0]),
        });

        setPreview(data.imageUrl);
      } catch (error) {
        console.error("❌ LOAD MESS ERROR:", error);
        toast.error("Failed to load mess");
      }

      setLoading(false);
    }

    loadMess();
  }, [id, router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // console.log(`✏️ Updating field: ${name} →`, value);

    if (name === "imageUrl") setPreview(value);

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // console.log("🔍 Validating Form:", form);

    if (form.name.length < 3) return "Mess name must be at least 3 characters.";
    if (form.description.length < 10)
      return "Description must be at least 10 characters.";
    if (+form.chargesPerMonth < 500)
      return "Monthly charge must be at least ₹500.";
    if (form.mobileNumber.length !== 10)
      return "Enter a valid 10-digit number.";
    if (!form.imageUrl.startsWith("http"))
      return "Image URL must start with http.";

    return null;
  };

  // 🔥 Update Handler
  const handleUpdate = async (e: any) => {
    e.preventDefault();

    // console.log("🟡 SUBMIT CLICKED — PAYLOAD BEFORE VALIDATION:", form);

    const err = validateForm();
    if (err) {
      console.log("❌ VALIDATION FAILED:", err);
      return toast.error(err);
    }

    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      chargesPerMonth: Number(form.chargesPerMonth),
      mobileNumber: Number(form.mobileNumber),
      imageUrl: form.imageUrl,
      foodType: form.foodType,
      address: form.address,
      location: {
        type: "Point",
        coordinates: [Number(form.lng), Number(form.lat)],
      },
    };

    // console.log("📤 SENDING UPDATE PAYLOAD:", payload);

    const res = await fetch(`/api/mess/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // console.log("📥 PUT STATUS:", res.status);

    let result = null;
    try {
      result = await res.json();
      // console.log("📌 PUT RESPONSE:", result);
    } catch (err) {
      console.log("⚠️ PUT response has no JSON");
    }

    setSaving(false);

    if (res.ok) {
      toast.success("Mess updated successfully!");
      router.push("/");
    } else {
      toast.error("Update failed");
    }
  };

  // 🔥 Delete Handler
const handleDelete = () => {
  toast.warning("Delete this mess permanently?", {
    action: {
      label: "Delete",
      onClick: async () => {
        setDeleting(true);

        const res = await fetch(`/api/mess/${id}`, { method: "DELETE" });

        setDeleting(false);

        if (res.ok) {
          toast.success("Mess deleted");
          router.push("/");
        } else {
          toast.error("Delete failed");
        }
      },
    },
  });
};


  if (loading)
    return (
      <p className="text-center py-20 text-slate-300 text-lg">
        Loading mess details...
      </p>
    );

  return (
    <div className="min-h-screen px-4 sm:px-6 py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-black">

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Edit Mess Details</h1>
        <p className="text-slate-400 mt-3">
          Update your mess information anytime.
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl p-8 space-y-6"
      >
        {/* IMAGE PREVIEW */}
        {preview ? (
          <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-700">
            <img src={preview} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-48 flex items-center justify-center text-slate-600 rounded-xl border border-slate-700">
            <ImageIcon size={40} />
          </div>
        )}

        <Input label="Mess Name" name="name" value={form.name} onChange={handleChange} />
        <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input label="Monthly Charges" name="chargesPerMonth" value={form.chargesPerMonth} onChange={handleChange} />
          <Input label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} />
        </div>

        <Input label="Image URL" name="imageUrl" value={form.imageUrl} onChange={handleChange} />

        <div className="text-slate-300">
          <label className="text-sm">Food Type</label>
          <div className="flex gap-6 mt-2">
            <Radio name="foodType" value="veg" form={form} onChange={handleChange} label="Veg" icon={<Leaf size={16} />} />
            <Radio name="foodType" value="nonveg" form={form} onChange={handleChange} label="Non-Veg" icon={<UtensilsCrossed size={16} />} />
            <Radio name="foodType" value="both" form={form} onChange={handleChange} label="Both" icon="🍽️" />
          </div>
        </div>

        <Input label="Address" name="address" value={form.address} onChange={handleChange} />

        <button disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 rounded-xl shadow-lg">
          {saving ? "Saving..." : "Update Mess"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl shadow-lg"
        >
          {deleting ? "Deleting..." : "Delete Mess"}
        </button>
      </form>
    </div>
  );
}

/* --- Reusable Inputs --- */

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="text-slate-300 text-sm">{label}</label>
      <input {...props} className="mt-1 w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3" />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div>
      <label className="text-slate-300 text-sm">{label}</label>
      <textarea {...props} className="mt-1 w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 h-24" />
    </div>
  );
}

function Radio({ name, value, form, onChange, label, icon }: any) {
  return (
    <label className="flex items-center gap-2 text-slate-300">
      <input type="radio" name={name} value={value} checked={form[name] === value} onChange={onChange} />
      {icon} {label}
    </label>
  );
}
