import { env } from "@/env.mjs";
import { deleteUserShortUrl } from "@/lib/dto/short-urls";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;
    if (user.role !== "ADMIN") {
      return Response.json("Unauthorized", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const { url_id, userId } = await req.json();
    if (!url_id || !userId) {
      return Response.json("url id is required", {
        status: 400,
        statusText: "url id is required",
      });
    }

    await deleteUserShortUrl(userId, url_id);
    return Response.json("success");
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
