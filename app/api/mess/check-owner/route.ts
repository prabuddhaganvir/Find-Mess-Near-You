import Owner from "@/app/models/Owner";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    // 1️⃣ Read token sent from mobile
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify Clerk JWT
    const { userId } = await auth({
      token: authHeader.replace("Bearer ", ""),
    });

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 3️⃣ Business logic
    const mess = await Owner.findOne({ ownerId: userId });

    // 4️⃣ ALWAYS return JSON
    return Response.json({
      exists: !!mess,
      messId: mess?._id || null,
    });
  } catch (err) {
    console.error("check-owner error:", err);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
