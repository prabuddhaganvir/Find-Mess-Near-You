import Owner from "@/app/models/Owner";

export async function GET() {
  try {
    const mess = await Owner.findOne();

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
