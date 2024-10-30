import { env } from "@/env.mjs";
import { checkApiKey } from "@/lib/dto/api-key";
import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { isLink } from "@/lib/utils";

export const revalidate = 60;

// export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const link = url.searchParams.get("url");
    const full = url.searchParams.get("full") || "false";
    const width = url.searchParams.get("width") || "1600";
    const height = url.searchParams.get("height") || "1200";
    const viewportWidth = url.searchParams.get("viewportWidth") || "1080";
    const viewportHeight = url.searchParams.get("viewportHeight") || "1080";
    const forceReload = url.searchParams.get("forceReload") || "false";
    const isMobile = url.searchParams.get("isMobile") || "false";
    const isDarkMode = url.searchParams.get("isDarkMode") || "false";
    const deviceScaleFactor = url.searchParams.get("deviceScaleFactor") || "1";

    // Check if the url is valid
    if (!link || !isLink(link)) {
      return Response.json("Invalid url", {
        status: 400,
        statusText: "Invalid url",
      });
    }

    // Get the API key from the request
    const custom_apiKey = url.searchParams.get("key");
    if (!custom_apiKey) {
      return Response.json(
        "API key is required. You can get your API key from your Dashboard-Settings.",
        {
          status: 400,
          statusText:
            "API key is required. You can get your API key from your Dashboard-Settings.",
        },
      );
    }

    // Check if the API key is valid
    const user_apiKey = await checkApiKey(custom_apiKey);
    if (!user_apiKey?.id) {
      return Response.json("Invalid API key", {
        status: 403,
        statusText: "Invalid API key",
      });
    }

    const { SCREENSHOTONE_BASE_URL } = env;
    const scrape_url = `${SCREENSHOTONE_BASE_URL}?url=${link}&isFullPage=${full}&width=${width}&height=${height}&viewportWidth=${viewportWidth}&viewportHeight=${viewportHeight}&forceReload=${forceReload}&isMobile=${isMobile}&isDarkMode=${isDarkMode}&deviceScaleFactor=${deviceScaleFactor}`;
    // console.log("[Scrape Url]", scrape_url);

    const res = await fetch(scrape_url);
    if (!res.ok) {
      return Response.json("Failed to get screenshot", {
        status: 406,
        statusText: "Failed to get screenshot",
      });
    }

    const imageBuffer = await res.arrayBuffer();
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json("Server error", {
      status: error.status || 500,
      statusText: "Server error",
    });
  }
}
