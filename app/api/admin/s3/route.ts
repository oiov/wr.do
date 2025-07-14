import { NextRequest } from "next/server";

import {
  getMultipleConfigs,
  updateSystemConfig,
} from "@/lib/dto/system-config";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const configs = await getMultipleConfigs(["s3_config_list"]);

    return Response.json(configs, { status: 200 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", { status: 401 });
    }

    const { key, value, type } = await req.json();
    if (!key || !type) {
      return Response.json("key and value is required", { status: 400 });
    }

    const configs = await getMultipleConfigs([key]);

    if (key in configs) {
      await updateSystemConfig(key, { value, type });
      return Response.json("Success", { status: 200 });
    }
    return Response.json("Invalid key", { status: 400 });
  } catch (error) {
    console.error("[Error]", error);
    return Response.json(error.message || "Server error", { status: 500 });
  }
}
