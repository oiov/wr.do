import { env } from "@/env.mjs";
import { checkApiKey } from "@/lib/dto/api-key";
import { createScrapeMeta } from "@/lib/dto/scrape";
import { getIpInfo } from "@/lib/geo";
import { isLink } from "@/lib/utils";

export const revalidate = 60;

// export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const link = url.searchParams.get("url");
    const full = url.searchParams.get("full") || "false";
    const width = url.searchParams.get("width") || "1200";
    const height = url.searchParams.get("height") || "750";
    const viewportWidth = url.searchParams.get("viewportWidth") || "1200";
    const viewportHeight = url.searchParams.get("viewportHeight") || "750";
    const forceReload = url.searchParams.get("forceReload") || "false";
    const isMobile = url.searchParams.get("isMobile") || "false";
    const isDarkMode = url.searchParams.get("isDarkMode") || "false";
    const deviceScaleFactor = url.searchParams.get("deviceScaleFactor") || "1";

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

    const { SCREENSHOTONE_BASE_URL } = env;
    const scrape_url = `${SCREENSHOTONE_BASE_URL}?url=${link}&isFullPage=${full}&width=${width}&height=${height}&viewportWidth=${viewportWidth}&viewportHeight=${viewportHeight}&forceReload=${forceReload}&isMobile=${isMobile}&isDarkMode=${isDarkMode}&deviceScaleFactor=${deviceScaleFactor}`;
    // console.log("[Scrape Url]", scrape_url);

    const res = await fetch(scrape_url);
    if (!res.ok) {
      return Response.json(
        { statusText: "Failed to get screenshot" },
        {
          status: 406,
        },
      );
    }

    const stats = await getIpInfo(req);
    await createScrapeMeta({
      ip: stats.ip || "::1",
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

    const imageBuffer = await res.arrayBuffer();
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    return Response.json({ statusText: "Server error" }, { status: 500 });
  }
}
