import QRCode from "qrcode";

import { env } from "@/env.mjs";
import { checkApiKey } from "@/lib/dto/api-key";
import { createScrapeMeta } from "@/lib/dto/scrape";
import { getIpInfo, isLink } from "@/lib/utils";

export const revalidate = 60;

// export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const link = url.searchParams.get("url");
    const width = parseInt(url.searchParams.get("width") || "200");
    const margin = parseInt(url.searchParams.get("margin") || "4");
    const dark = url.searchParams.get("dark") || "#000000";
    const light = url.searchParams.get("light") || "#ffffff";
    const type = url.searchParams.get("type") || "svg";

    // Check if the url is valid
    if (!link || !isLink(link)) {
      return Response.json(
        { statusText: "Url is required" },
        {
          status: 400,
        },
      );
    }

    // Get the API key from the request
    const custom_apiKey = url.searchParams.get("key");
    if (!custom_apiKey) {
      return Response.json(
        {
          statusText:
            "API key is required. You can get your API key from Dashboard->Settings.",
        },
        { status: 400 },
      );
    }

    // Check if the API key is valid
    const user_apiKey = await checkApiKey(custom_apiKey);
    if (!user_apiKey?.id) {
      return Response.json(
        {
          statusText:
            "Invalid API key. You can get your API key from Dashboard->Settings.",
        },
        { status: 401 },
      );
    }

    const options = {
      width,
      margin,
      color: {
        dark,
        light,
      },
      errorCorrectionLevel: "H", // 可选值: L, M, Q, H
      type: type === "svg" ? "svg" : "image/png",
    };

    const stats = getIpInfo(req);
    await createScrapeMeta({
      ip: stats.ip,
      type: "screenshot",
      referer: stats.referer,
      city: stats.city,
      region: stats.region,
      country: stats.country,
      latitude: stats.latitude,
      longitude: stats.longitude,
      lang: stats.lang,
      device: stats.device,
      browser: stats.browser,
      click: 1,
      userId: user_apiKey.id,
      apiKey: custom_apiKey,
      link,
    });

    let qrResult;
    // if (type === 'svg') {
    //   // 生成 SVG 格式的二维码
    //   qrResult = await QRCode.toString(link, options);
    //   return new Response(qrResult, {
    //     status: 200,
    //     headers: {
    //       "Content-Type": "image/svg+xml",
    //     },
    //   });
    // } else {
    //   // 生成 Base64 格式的二维码
    //   qrResult = await QRCode.toDataURL(link, options);
    //   return new Response(qrResult);
    // }
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
