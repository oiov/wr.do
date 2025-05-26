import maxmind, { CityResponse } from "maxmind";

import { extractRealIP, getIpInfo } from "@/lib/geo";

export async function GET(req: Request) {
  try {
    const data = await getIpInfo(req);

    const i_p = extractRealIP(req.headers);
    const ge_o = await getGeoFromIP(i_p);
    console.log("自助ip", i_p, ge_o);

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
      ge_o,
    });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}

export async function getGeoFromIP(ip: string) {
  try {
    const lookup = await maxmind.open<CityResponse>("./GeoLite2-City.mmdb");

    const result = lookup.get(ip);
    if (!result) return null;

    return {
      ip,
      country: result.country?.names?.en,
      city: result.city?.names?.en,
      region: result.subdivisions?.[0]?.names?.en,
      // timezone: result.location?.time_zone
    };
  } catch (error) {
    console.error("IP地理位置查询失败:", error);
    return null;
  }
}
