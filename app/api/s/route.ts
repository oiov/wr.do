import { NextRequest, NextResponse } from "next/server";

import { createUserShortUrlMeta, getUrlBySuffix } from "@/lib/dto/short-urls";

export async function POST(req: NextRequest) {
  try {
    const {
      slug,
      referer,
      ip,
      city,
      region,
      country,
      latitude,
      longitude,
      lang,
      device,
      browser,
    } = await req.json();

    if (!slug || !ip) return Response.json(null);

    const res = await getUrlBySuffix(slug);
    if (res?.target && res?.active === 1) {
      const now = Date.now();
      const createdAt = new Date(res.updatedAt).getTime();
      const expirationMilliseconds = Number(res.expiration) * 1000;
      const expirationTime = createdAt + expirationMilliseconds;

      if (res.expiration !== "-1" && now > expirationTime) {
        return Response.json(null);
      }

      console.log("[api/s]", device, browser);
      await createUserShortUrlMeta({
        urlId: res.id,
        click: 1,
        ip: ip ? ip.split(",")[0] : "127.0.0.1",
        city,
        region,
        country,
        latitude,
        longitude,
        referer,
        lang,
        device,
        browser,
      });
      return Response.json(res.target);
    }
    return Response.json(null);
  } catch (error) {
    return Response.json(null);
  }
}
