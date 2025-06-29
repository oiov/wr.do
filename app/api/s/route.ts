import { NextRequest } from "next/server";

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
      engine,
      os,
      cpu,
      isBot,
      password,
    } = await req.json();

    if (!slug || !ip) return Response.json("Missing[0000]");

    const res = await getUrlBySuffix(slug);
    if (!res) return Response.json("Missing[0000]");

    if (res.active !== 1) return Response.json("Disabled[0002]");

    if (res.password !== "") {
      if (!password) {
        return Response.json("PasswordRequired[0004]");
      }
      if (password !== res.password) {
        return Response.json("IncorrectPassword[0005]");
      }
    }

    const now = Date.now();
    const createdAt = new Date(res.updatedAt).getTime();
    const expirationMilliseconds = Number(res.expiration) * 1000;
    const expirationTime = createdAt + expirationMilliseconds;

    if (res.expiration !== "-1" && now > expirationTime) {
      return Response.json("Expired[0001]");
    }

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
      engine,
      os,
      cpu,
      isBot,
    });
    return Response.json(res.target);
  } catch (error) {
    return Response.json("Error[0003]");
  }
}
