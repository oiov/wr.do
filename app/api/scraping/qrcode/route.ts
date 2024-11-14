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
    const type = url.searchParams.get("type") || "png"; // png  | jpeg | webp | string

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

    let qrResult: any;
    if (type === "string") {
      qrResult = QRCode.toString(link);
    } else {
      qrResult = await QRCode.toDataURL(link, {
        width,
        margin,
        color: {
          dark,
          light,
        },
        errorCorrectionLevel: "H", // Optional: L, M, Q, H
        type:
          type === "png"
            ? "image/png"
            : type === "jepg"
              ? "image/jpeg"
              : "image/webp",
      });
    }

    const stats = getIpInfo(req);
    await createScrapeMeta({
      ip: stats.ip,
      type: "qrcode",
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

    return new Response(qrResult);
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
