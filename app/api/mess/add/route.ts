import { auth, currentUser } from "@clerk/nextjs/server";
import Owner from "@/app/models/Owner";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ⭐ Always fetch email from Clerk backend (RELIABLE)
  const email = user.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return Response.json({ error: "No email found for user" }, { status: 400 });
  }

  const body = await req.json();

  const {
    name,
    description,
    chargesPerMonth,
    mobileNumber,
    imageUrl,
    foodType,
    address,
    lat,
    lng,
  } = body;

  // ❌ Check if already created a mess
  const existing = await Owner.findOne({ ownerId: userId });

  if (existing) {
    return Response.json(
      { success: false, message: "❌ You already created a mess." },
      { status: 400 }
    );
  }

  // ⭐ Create Mess with email added
  const doc = await Owner.create({
    ownerId: userId,
    email: email, // ← ← ← IMPORTANT: save email here
    name,
    description,
    chargesPerMonth,
    mobileNumber,
    imageUrl,
    foodType,
    address,
    location: {
      type: "Point",
      coordinates: [Number(lng), Number(lat)],
    },
  });

  return Response.json(
    {
      success: true,
      message: "Mess added successfully",
      data: doc,
    },
    { status: 201 }
  );
}
