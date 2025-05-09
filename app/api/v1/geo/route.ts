import { ipAddress } from "@vercel/functions";

import { getIpInfo } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const data = getIpInfo(req);
    const ip = ipAddress(req);

    return Response.json({
      ip,
      city: data.city,
      region: data.region,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      flag: data.flag,
      lang: data.lang,
      device: data.device,
      browser: data.browser,
    });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
