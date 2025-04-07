import { NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { auth } from "auth";
import { NextAuthRequest } from "next-auth/lib";
import UAParser from "ua-parser-js";

import { siteConfig } from "./config/site";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const redirectMap = {
  "Missing[0000]": "/docs/short-urls#missing-links",
  "Expired[0001]": "/docs/short-urls#expired-links",
  "Disabled[0002]": "/docs/short-urls#disabled-links",
  "Error[0003]": "/docs/short-urls#error-links",
  "PasswordRequired[0004]": "/password-prompt?error=0&slug=",
  "IncorrectPassword[0005]": "/password-prompt?error=1&slug=",
};

// 提取短链接处理逻辑
async function handleShortUrl(req: NextAuthRequest) {
  if (!req.url.includes("/s/")) return NextResponse.next();

  const slug = extractSlug(req.url);
  if (!slug)
    return NextResponse.redirect(`${siteConfig.url}/docs/short-urls`, 302);

  const geo = geolocation(req);
  const headers = req.headers;
  const { browser, device } = parseUserAgent(headers.get("user-agent") || "");

  const url = new URL(req.url);
  const password = url.searchParams.get("password") || "";

  const trackingData = {
    slug,
    referer: headers.get("referer") || "(None)",
    ip: headers.get("X-Forwarded-For"),
    city: geo?.city,
    region: geo?.region,
    country: geo?.country,
    latitude: geo?.latitude,
    longitude: geo?.longitude,
    flag: geo?.flag,
    lang: headers.get("accept-language")?.split(",")[0],
    device: device.model || "Unknown",
    browser: browser.name || "Unknown",
    password,
  };

  const res = await fetch(`${siteConfig.url}/api/s`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trackingData),
  });

  if (!res.ok)
    return NextResponse.redirect(
      `${siteConfig.url}${redirectMap["Error[0003]"]}`,
      302,
    );

  const target = await res.json();

  if (!target || typeof target !== "string") {
    return NextResponse.redirect(
      `${siteConfig.url}${redirectMap["Error[0003]"]}`,
      302,
    );
  }

  if (target in redirectMap) {
    if (
      ["PasswordRequired[0004]", "IncorrectPassword[0005]"].includes(target)
    ) {
      return NextResponse.redirect(
        `${siteConfig.url}${redirectMap[target]}${slug}`,
        302,
      );
    }

    return NextResponse.redirect(
      `${siteConfig.url}${redirectMap[target]}`,
      302,
    );
  }

  return NextResponse.redirect(target, 302);
}

// 提取 slug
function extractSlug(url: string): string | null {
  const match = url.match(/([^/?]+)(?:\?.*)?$/);
  return match ? match[1] : null;
}

// 解析用户代理
const parser = new UAParser();
function parseUserAgent(ua: string) {
  parser.setUA(ua);
  return {
    browser: parser.getBrowser(),
    device: parser.getDevice(),
  };
}

export default auth(async (req) => {
  try {
    return await handleShortUrl(req);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(siteConfig.url, 302);
  }
});
