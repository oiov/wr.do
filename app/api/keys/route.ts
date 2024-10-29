import { env } from "@/env.mjs";
import { generateApiKey } from "@/lib/dto/api-key";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const res = await generateApiKey(user.id);
    if (res) {
      return Response.json(res.apiKey);
    }
    return Response.json(res, {
      status: 501,
      statusText: "Server error",
    });
  } catch (error) {
    return Response.json("An error occurred", {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
