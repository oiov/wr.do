import { checkApiKey } from "@/lib/dto/api-key";
import { getDomainsByFeature } from "@/lib/dto/domains";
import { getPlanQuota } from "@/lib/dto/plan";
import { createUserShortUrl } from "@/lib/dto/short-urls";
import { restrictByTimeRange } from "@/lib/team";
import { createUrlSchema } from "@/lib/validations/url";

export async function POST(req: Request) {
  try {
    const custom_api_key = req.headers.get("wrdo-api-key");
    if (!custom_api_key) {
      return Response.json("Unauthorized", {
        status: 401,
      });
    }

    // Check if the API key is valid
    const user = await checkApiKey(custom_api_key);
    if (!user?.id) {
      return Response.json(
        "Invalid API key. You can get your API key from https://wr.do/dashboard/settings.",
        { status: 401 },
      );
    }

    const plan = await getPlanQuota(user.team!);

    // check limit
    const limit = await restrictByTimeRange({
      model: "userUrl",
      userId: user.id,
      limit: plan.slNewLinks,
      rangeType: "month",
    });
    if (limit) return Response.json(limit.statusText, { status: limit.status });

    const data = await req.json();

    const { target, url, prefix, visible, active, expiration, password } =
      createUrlSchema.parse(data);
    if (!target || !url) {
      return Response.json("Target url and slug are required", {
        status: 400,
      });
    }

    const zones = await getDomainsByFeature("enable_short_link");
    if (
      !zones.length ||
      !zones.map((zone) => zone.domain_name).includes(prefix)
    ) {
      return Response.json("Invalid domain", {
        status: 409,
        statusText: "Invalid domain",
      });
    }

    const limit_len =
      zones.find((zone) => zone.domain_name === prefix)?.min_url_length ?? 3;
    if (!url || url.length < limit_len) {
      return Response.json(`Slug length must be at least ${limit_len}`, {
        status: 400,
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
