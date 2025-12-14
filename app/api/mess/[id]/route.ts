import { connectDB } from "@/lib/db";
import Owner from "@/app/models/Owner";



export async function GET(req: Request, context: any) {
  await connectDB();
  const { id } = await context.params;

  console.log("📌 GET MESS:", id);

  const mess = await Owner.findById(id).lean();
  if (!mess) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(mess, { status: 200 });
}

export async function PUT(req: Request, context: any) {
  await connectDB();

  const { id } = await context.params;
  const body = await req.json();

  console.log("📌 UPDATE ID:", id);
  console.log("📥 UPDATE PAYLOAD:", body);

  // 👍 Extract location safely
  const coord = body.location?.coordinates;

  const finalLocation = coord
    ? {
        type: "Point",
        coordinates: [
          Number(coord[0]),
          Number(coord[1]),
        ],
      }
    : undefined; // if not provided, keep existing

  const updated = await Owner.findByIdAndUpdate(
    id,
    {
      ...body,
      ...(finalLocation && { location: finalLocation }),
    },
    { new: true, runValidators: true }
  );

  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json(
    { success: true, message: "Mess updated", data: updated },
    { status: 200 }
  );
}

export async function DELETE(req: Request, context: any) {
  await connectDB();

  const { id } = await context.params;

  const deleted = await Owner.findByIdAndDelete(id);
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ success: true }, { status: 200 });
}
