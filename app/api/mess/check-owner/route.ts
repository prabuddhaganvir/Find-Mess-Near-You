import Owner from "@/app/models/Owner";
import { verifyToken } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // ✅ VERIFY JWT (THIS IS THE KEY FIX)
    const payload = await verifyToken(token);

    const userId = payload.sub; // 👈 Clerk userId

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
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
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
