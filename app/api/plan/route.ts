import { NextRequest } from "next/server";

import { getAllPlans, getPlanQuota } from "@/lib/dto/plan";

export const dynamic = "force-dynamic";

// Get one plan by plan name for frontend
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const isAll = url.searchParams.get("all") || "0";
    const team = url.searchParams.get("team") || "free";

    if (isAll === "1") {
      const res = await getAllPlans();
      if (res) {
        return Response.json(res, { status: 200 });
      }
    } else {
      const res = await getPlanQuota(team);
      if (res) {
        return Response.json(res, { status: 200 });
      }
    }
    return Response.json("Plan not found", { status: 400 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
