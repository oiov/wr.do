import { env } from "@/env.mjs";
import { getUserRecords } from "@/lib/dto/cloudflare-dns-record";
import {
  updateUserShortUrl,
  updateUserShortUrlActive,
} from "@/lib/dto/short-urls";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { createUrlSchema } from "@/lib/validations/url";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { id, active } = await req.json();

    if (!id) {
      return Response.json(
        {
          statusText: "Id is required",
        },
        { status: 400 },
      );
    }

    const res = await updateUserShortUrlActive(user.id, id, active, user.role);
    if (res.status !== "success") {
      return Response.json(res.status, {
        status: 400,
        statusText: `An error occurred. ${res.status}`,
      });
    }
    return Response.json(res.data);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
