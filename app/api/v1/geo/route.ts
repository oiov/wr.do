import { extractRealIP, getIpInfo } from "@/lib/geo";

export async function GET(req: Request) {
  try {
    const data = await getIpInfo(req);

    const i_p = extractRealIP(req.headers);
    console.log("自助ip", i_p);

    return Response.json({
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      flag: data.flag,
      lang: data.lang,
      device: data.device,
      browser: data.browser,
      i_p,
    });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
