import Owner from "@/app/models/Owner";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB(); // ⭐ REQUIRED

    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { exists: false, messId: null },
        { status: 401 }
      );
    }

    const mess = await Owner.findOne({ ownerId: userId });

    return Response.json({
      exists: !!mess,
      messId: mess?._id || null,
    });
  } catch (err) {
    console.error("check-owner error:", err);

    return Response.json(
      { exists: false, messId: null },
      { status: 500 }
    );
  }
}
