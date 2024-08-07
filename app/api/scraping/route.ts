import cheerio from "cheerio";

export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const link = url.searchParams.get("link");
    if (!link) {
      return Response.json("link is required", {
        status: 400,
        statusText: "link is required",
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
    console.log(html);

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

    return Response.json({ title, description, image });
  } catch (error) {
    console.log(error);
    return Response.json(error?.statusText || error, {
      status: error.status || 500,
      statusText: error.statusText || "Server error",
    });
  }
}
