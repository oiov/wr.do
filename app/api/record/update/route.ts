import { env } from "@/env.mjs";
import { getCurrentUser } from "@/lib/session";
import { checkUserStatus } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
  } catch (error) {
    console.error(error);
    return Response.json(error, {
      status: 500,
      statusText: "Server error",
    });
  }
}
