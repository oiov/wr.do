import { env } from "@/env.mjs";
import { createUserShortUrl } from "@/lib/dto/short-urls";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { createUrlSchema } from "@/lib/validations/url";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { data } = await req.json();

    const { target, url, visible, active } = createUrlSchema.parse(data);
    const res = await createUserShortUrl({
      userId: user.id,
      userName: user.name || "Anonymous",
      target,
      url,
      visible,
      active,
    });
    if (res.status !== "success") {
      return Response.json(res.status, {
        status: 502,
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
