import cheerio from "cheerio";

import { checkApiKey } from "@/lib/dto/api-key";
import { createScrapeMeta } from "@/lib/dto/scrape";
import { getIpInfo } from "@/lib/geo";
import { isLink } from "@/lib/utils";

export const revalidate = 600;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const link = url.searchParams.get("url");
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

    const res = await fetch(link);
    if (!res.ok) {
      return Response.json(
        { statusText: "Failed to fetch url" },
        {
          status: 405,
        },
      );
    }

    const html = await res.text();

    const $ = cheerio.load(html);

    // 移除所有 HTML 标签，只保留文本
    $("script").remove();
    $("style").remove();
    const text = $("body").text().trim();

    const stats = await getIpInfo(req);
    await createScrapeMeta({
      ip: stats.ip || "::1",
      type: "text",
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

    return Response.json({
      url: link,
      content: text,
      format: "text",
      timestamp: Date.now(),
      payload: `https://wr.do/api/v1/scraping/text?url=${link}&key=${custom_apiKey}`,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { statusText: "Server error" },
      {
        status: 500,
      },
    );
  }
}
