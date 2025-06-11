import { NextRequest } from "next/server";

import { getPlanNames } from "@/lib/dto/plan";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// Get plan names for frontend
export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const res = await getPlanNames();
    if (!res) {
      return Response.json("Plans not found", { status: 400 });
    }

    return Response.json(res, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
