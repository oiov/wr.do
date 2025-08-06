import cheerio from "cheerio";

import { checkApiKey } from "@/lib/dto/api-key";
import { createScrapeMeta } from "@/lib/dto/scrape";
import { getIpInfo } from "@/lib/geo";
import { isLink, removeUrlPrefix } from "@/lib/utils";

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
        { statusText: `Failed to fetch url. ${res.statusText}` },
        {
          status: res.status || 405,
        },
      );
    }

    const html = await res.text();
    // console.log(html);

    const $ = cheerio.load(html);
    const title =
      $("title").text() ||
      $("meta[property='og:title']").attr("content") ||
      $("meta[name='twitter:title']").attr("content");
    const description =
      $("meta[name='description']").attr("content") ||
      $("meta[property='og:description']").attr("content") ||
      $("meta[name='twitter:description']").attr("content");
    const image =
      $("meta[property='og:image']").attr("content") ||
      $("meta[name='og:image']").attr("content") ||
      $("meta[property='twitter:image']").attr("content") ||
      $("meta[name='twitter:image']").attr("content");
    const icon =
      $("link[rel='icon']").attr("href") ||
      $("link[rel='apple-touch-icon']").attr("href") ||
      `https://icon.wr.do/${removeUrlPrefix(link)}.ico`;
    const lang =
      $("html").attr("lang") ||
      $("html").attr("xml:lang") ||
      $("body").attr("lang") ||
      $("body").attr("xml:lang");
    const author =
      $("meta[name='author']").attr("content") ||
      $("meta[property='author']").attr("content");

    const stats = await getIpInfo(req);
    await createScrapeMeta({
      ip: stats.ip || "::1",
      type: "meta-info",
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
      title,
      description,
      image,
      icon,
      url: link,
      lang,
      author,
      timestamp: Date.now(),
      payload: `https://wr.do/api/v1/scraping/meta?url=${link}&key=${custom_apiKey}`,
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
