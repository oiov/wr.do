import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

interface CurrentLocation {
  latitude: number;
  longitude: number;
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const geo = geolocation(req);

    const location: CurrentLocation = {
      latitude: Number(geo.latitude || "0"),
      longitude: Number(geo.longitude || "0"),
    };

    return NextResponse.json(location, { status: 200 });
  } catch (error) {
    console.error("Error fetching location:", error);
    // Fallback to default coordinates
    return NextResponse.json(
      { latitude: 40.7128, longitude: -74.006 },
      { status: 200 },
    );
  }
}
