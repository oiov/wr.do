import { env } from "@/env.mjs";
import { createUserShortUrl, getUserShortUrlCount } from "@/lib/dto/short-urls";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { Team_Plan_Quota } from "@/lib/team";
import { createUrlSchema } from "@/lib/validations/url";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const { NEXT_PUBLIC_FREE_URL_QUOTA } = env;

    // check quota
    const user_urls_count = await getUserShortUrlCount(user.id);
    if (user_urls_count >= Team_Plan_Quota[user.team].SL_NewLinks) {
      return Response.json("Your short urls have reached the free limit.", {
        status: 409,
      });
    }

    const { data } = await req.json();

    const { target, url, prefix, visible, active, expiration } =
      createUrlSchema.parse(data);
    const res = await createUserShortUrl({
      userId: user.id,
      userName: user.name || "Anonymous",
      target,
      url,
      prefix,
      visible,
      active,
      expiration,
    });
    if (res.status !== "success") {
      return Response.json(res.status, {
        status: 502,
      });
    }
    return Response.json(res.data);
  } catch (error) {
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
    });
  }
}
