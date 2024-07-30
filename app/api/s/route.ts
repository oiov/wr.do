import { NextRequest, NextResponse } from "next/server";

import { createUserShortUrlMeta, getUrlBySuffix } from "@/lib/dto/short-urls";

export async function GET(req: NextRequest) {
  try {
    console.log("[api/s]", req.ip, req.geo);

    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (!slug) return Response.json(null);

    const res = await getUrlBySuffix(slug);
    if (res?.target && res?.active === 1) {
      await createUserShortUrlMeta({
        urlId: res.id,
        click: 1,
        ip: req.ip ?? "127.0.0.0",
        city: req.geo?.city ?? "",
        region: req.geo?.region ?? "",
        country: req.geo?.country ?? "",
        latitude: req.geo?.latitude ?? "",
        longitude: req.geo?.longitude ?? "",
      });
      return Response.json(res.target);
    }
    return Response.json(null);
  } catch (error) {
    return Response.json(null);
  }
}
