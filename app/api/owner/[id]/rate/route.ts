import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Owner from "@/app/models/Owner";
import { connectDB } from "@/lib/db";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { rating } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const owner = await Owner.findById(id);
    if (!owner) {
      return NextResponse.json(
        { message: "Owner not found" },
        { status: 404 }
      );
    }

    const ratings = owner.ratings || [];

    // ❌ prevent same user rating again
    const alreadyRated = ratings.find(
      (r: any) => r.userId === userId
    );

    if (alreadyRated) {
      return NextResponse.json(
        {
          message: "Already rated",
          average: owner.rating?.average || 0,
          count: owner.rating?.count || ratings.length,
          hasRated: true,
        },
        { status: 200 }
      );
    }

    // ✅ add rating locally
    const updatedRatings = [...ratings, { userId, value: rating }];

    const total = updatedRatings.reduce(
      (sum: number, r: any) => sum + r.value,
      0
    );

    const newCount = updatedRatings.length;
    const newAverage = Number((total / newCount).toFixed(1));

    // ✅ ATOMIC UPDATE (NO VALIDATION ERROR)
    await Owner.findByIdAndUpdate(
      id,
      {
        $set: {
          "rating.average": newAverage,
          "rating.count": newCount,
          ratings: updatedRatings,
        },
      },
      { new: true }
    );

    return NextResponse.json({
      average: newAverage,
      count: newCount,
      hasRated: true,
    });
  } catch (error) {
    console.error("Rating API error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
