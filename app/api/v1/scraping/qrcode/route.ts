import { ImageResponse } from "@vercel/og";

import { checkApiKey } from "@/lib/dto/api-key";
import { createScrapeMeta } from "@/lib/dto/scrape";
import { getIpInfo } from "@/lib/geo";
import { WRDO_QR_LOGO } from "@/lib/qr/constants";
import { QRCodeSVG } from "@/lib/qr/utils";
import { getSearchParams } from "@/lib/utils";
import { getQRCodeQuerySchema } from "@/lib/validations/qr";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function GET(req: Request) {
  try {
    const paramsParsed = getQRCodeQuerySchema.parse(getSearchParams(req.url));
    const { key, logo, url, size, level, fgColor, bgColor, margin, hideLogo } =
      paramsParsed;

    // Get the API key from the request
    if (!key) {
      return Response.json(
        {
          statusText:
            "API key is required. You can get your API key from Dashboard->Settings.",
        },
        { status: 400 },
      );
    }

    // Check if the API key is valid
    const user_apiKey = await checkApiKey(key);
    if (!user_apiKey?.id) {
      return Response.json(
        {
          statusText:
            "Invalid API key. You can get your API key from Dashboard->Settings.",
        },
        { status: 401 },
      );
    }

    const stats = await getIpInfo(req);
    await createScrapeMeta({
      ip: stats.ip || "::1",
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
      apiKey: key,
      link: url,
    });

    return new ImageResponse(
      QRCodeSVG({
        value: url,
        size,
        level,
        fgColor,
        bgColor,
        margin,
        ...(!hideLogo && {
          imageSettings: {
            src: logo || WRDO_QR_LOGO,
            height: size / 4,
            width: size / 4,
            excavate: true,
          },
        }),
        isOGContext: true,
      }),
      {
        width: size,
        height: size,
        headers: CORS_HEADERS,
      },
    );
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
