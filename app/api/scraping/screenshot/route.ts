import puppeteer from "puppeteer";

import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { isLink } from "@/lib/utils";

export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const user = checkUserStatus(await getCurrentUser());
    if (user instanceof Response) return user;

    const url = new URL(req.url);
    const link = url.searchParams.get("url");
    const full = url.searchParams.get("full") || "false";

    if (!link || !isLink(link)) {
      return Response.json("Invalid url", {
        status: 400,
        statusText: "Invalid url",
      });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: "networkidle2" });
    const screenshot = await page.screenshot({
      encoding: "base64",
      fullPage: full === "true",
    });
    await browser.close();

    return Response.json({
      data: `data:image/png;base64,${screenshot}`,
      url: link,
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
