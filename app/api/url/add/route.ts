import { getDomainsByFeature } from "@/lib/dto/domains";
import { getPlanQuota } from "@/lib/dto/plan";
import { createUserShortUrl } from "@/lib/dto/short-urls";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { restrictByTimeRange } from "@/lib/team";
import { createUrlSchema } from "@/lib/validations/url";

export async function POST(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const plan = await getPlanQuota(user.team);
    // check limit
    const limit = await restrictByTimeRange({
      model: "userUrl",
      userId: user.id,
      limit: plan.slNewLinks,
      rangeType: "month",
    });
    if (limit) return Response.json(limit.statusText, { status: limit.status });

    const { data } = await req.json();

    const { target, url, prefix, visible, active, expiration, password } =
      createUrlSchema.parse(data);

    const zones = await getDomainsByFeature("enable_short_link");
    if (
      !zones.length ||
      !zones.map((zone) => zone.domain_name).includes(prefix)
    ) {
      return Response.json("Invalid domain", {
        status: 400,
        statusText: "Invalid domain",
      });
    }

    const res = await createUserShortUrl({
      userId: user.id,
      userName: user.name || "Anonymous",
      target,
      url,
      prefix,
      visible,
      active,
      expiration,
      password,
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
