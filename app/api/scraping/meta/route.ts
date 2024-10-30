import cheerio from "cheerio";

import { checkApiKey } from "@/lib/dto/api-key";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { isLink, removeUrlSuffix } from "@/lib/utils";

export const revalidate = 600;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const link = url.searchParams.get("url");
    if (!link || !isLink(link)) {
      return Response.json("Url is required", {
        status: 400,
        statusText: "Url is required",
      });
    }

    // Get the API key from the request
    const custom_apiKey = url.searchParams.get("key");
    if (!custom_apiKey) {
      return Response.json(
        "API key is required. You can get your API key from Dashboard->Settings.",
        {
          status: 400,
          statusText:
            "API key is required. You can get your API key from Dashboard->Settings.",
        },
      );
    }

    // Check if the API key is valid
    const user_apiKey = await checkApiKey(custom_apiKey);
    if (!user_apiKey?.id) {
      return Response.json("error", {
        status: 401,
        statusText:
          "Invalid API key. You can get your API key from Dashboard->Settings.",
      });
    }

    const res = await fetch(link);
    if (!res.ok) {
      return Response.json("Failed to fetch url", {
        status: 405,
        statusText: "Failed to fetch url",
      });
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
      `https://icon.wr.do/${removeUrlSuffix(link)}.ico`;
    const lang =
      $("html").attr("lang") ||
      $("html").attr("xml:lang") ||
      $("body").attr("lang") ||
      $("body").attr("xml:lang");
    const author =
      $("meta[name='author']").attr("content") ||
      $("meta[property='author']").attr("content");

    return Response.json({
      title,
      description,
      image,
      icon,
      url: link,
      lang,
      author,
      timestamp: Date.now(),
      payload: `https://wr.do/api/scraping/meta?url=${link}&key=${custom_apiKey}`,
    });
  } catch (error) {
    // console.log(error);
    return Response.json("An error occurred", {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
