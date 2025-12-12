import Owner from "@/app/models/Owner";
import { auth } from "@clerk/nextjs/server";


export async function GET() {
  const { userId } = await auth();
  const mess = await Owner.findOne({ ownerId: userId });

  return Response.json({
    exists: !!mess,
    messId: mess?._id || null,
  });
}
