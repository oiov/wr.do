// import puppeteer from "puppeteer";

import { checkUserStatus } from "@/lib/dto/user";
import { getCurrentUser } from "@/lib/session";
import { isLink } from "@/lib/utils";

export const revalidate = 60;

// export const runtime = "edge";
const puppeteer = require("puppeteer");

export async function GET(req: Request) {
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

  let browser;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 1200 });
    await page.goto(link);
    const screenshot = await page.screenshot({
      encoding: "base64",
      fullPage: full === "true",
    });
    return Response.json({
      data: `data:image/png;base64,${screenshot}`,
      url: link,
      timestamp: Date.now(),
    });
  } catch (error) {
    return Response.json(error, {
      status: 500,
      statusText: error,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
