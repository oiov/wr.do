import { NextRequest } from "next/server";

import { FeatureMap, getDomainsByFeatureClient } from "@/lib/dto/domains";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// Get domains by feature for frontend
export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const feature = url.searchParams.get("feature") || "";

    if (!Object.keys(FeatureMap).includes(feature)) {
      return Response.json(
        "Invalid feature parameter. Use 'short', 'email', or 'record'.",
        {
          status: 400,
        },
      );
    }

    const domainList = await getDomainsByFeatureClient(FeatureMap[feature]);

    return Response.json(domainList, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
