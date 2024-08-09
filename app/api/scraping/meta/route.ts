import cheerio from "cheerio";

import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { isLink } from "@/lib/utils";

export const revalidate = 600;

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const link = url.searchParams.get("url");
    if (!link || !isLink(link)) {
      return Response.json("Url is required", {
        status: 400,
        statusText: "Url is required",
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
      $("link[rel='apple-touch-icon']").attr("href");
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
    });
  } catch (error) {
    console.log(error);
    return Response.json("An error occurred", {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
