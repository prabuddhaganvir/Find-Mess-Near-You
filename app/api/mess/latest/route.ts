import Owner from "@/app/models/Owner";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/mess/latest
export async function GET() {
  try {
    await connectDB();

    // latest mess = latest owner created
    const latestMess = await Owner.findOne().sort({ createdAt: -1 });

    if (!latestMess) {
      return NextResponse.json({ createdAt: null });
    }

    return NextResponse.json({
      createdAt: latestMess.createdAt,
      messId: latestMess._id,
      name: latestMess.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch latest mess" },
      { status: 500 }
    );
  }
}
