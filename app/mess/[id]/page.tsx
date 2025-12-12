import { connectDB } from "@/lib/db";
import Owner from "@/app/models/Owner";
import MessDetailsClient from "./MessDetailsClient";
import mongoose from "mongoose";

export default async function MessDetailsPage( props : any) {
 const { id } = await props.params;

  // 🛑 Prevent crash if id is invalid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return (
      <div className="text-center text-red-500 py-20">
        ❌ Invalid Mess ID
      </div>
    );
  }

  await connectDB();
  const data = await Owner.findById(id).lean();
  const mess = JSON.parse(JSON.stringify(data));

  if (!mess) {
    return (
      <div className="p-6 text-center text-red-500 text-lg">
        ❌ Mess not found
      </div>
    );
  }

  return <MessDetailsClient mess={mess} />;
}
