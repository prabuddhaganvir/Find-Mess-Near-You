import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Owner from "@/app/models/Owner";

// Haversine Distance
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export async function GET(req: NextRequest) {
  await connectDB();

  const lat = Number(req.nextUrl.searchParams.get("lat"));
  const lng = Number(req.nextUrl.searchParams.get("lng"));

  if (!lat || !lng) {
    return NextResponse.json([], { status: 200 });
  }

  // 🔹 SAME QUERY (untouched)
  const owners = await Owner.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: 3000, // 3KM
      },
    },
  });

  // 🔹 SAFE RESPONSE (rating guaranteed)
  const nearby = owners.map((m: any) => {
    const messLat = m.location.coordinates[1];
    const messLng = m.location.coordinates[0];

    const distance = getDistance(lat, lng, messLat, messLng);

    return {
      ...m._doc,

      // ⭐ IMPORTANT: always send rating object
      rating: {
        average: m.rating?.average ?? 0,
        count: m.rating?.count ?? 0,
      },

      distance,
    };
  });

  return NextResponse.json(nearby);
}
