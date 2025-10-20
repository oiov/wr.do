import { NextResponse } from "next/server";
import { ipAddress } from "@vercel/functions";
import { auth } from "auth";
import { NextAuthRequest } from "next-auth/lib";

import { siteConfig } from "./config/site";
import { extractRealIP, getGeolocation, getUserAgent } from "./lib/geo";
import { extractHost } from "./lib/utils";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const isVercel = process.env.VERCEL;

// 门户域名配置(只保留主机名，不包含端口、协议)
const PORTAL_DOMAIN = extractHost(
  process.env.NEXT_PUBLIC_APP_URL || "localhost",
);

const redirectMap = {
  "Missing[0000]": "/link-status?error=missing&slug=",
  "Expired[0001]": "/link-status?error=expired&slug=",
  "Disabled[0002]": "/link-status?error=disabled&slug=",
  "Error[0003]": "/link-status?error=system&slug=",
  "PasswordRequired[0004]": "/password-prompt?error=0&slug=",
  "IncorrectPassword[0005]": "/password-prompt?error=1&slug=",
};

const systemRoutes = [
  "/docs",
  "/dashboard",
  "/admin",
  "/feedback",
  "/pricing",
  "/plan",
  "/privacy",
  "/terms",
  "/auth",
  "/login",
  "/register",
  "/emails",
  "/link-status",
  "/password-prompt",
  "/chat",
  "/manifest.json",
  "/robots.txt",
  "/opengraph-image.jpg",
  "/favicon.ico",
];

// 获取主机名（不含端口）
function getHostname(hostname: string): string {
  return hostname.split(":")[0].toLowerCase();
}

// 判断是否为门户域名
function isPortalDomain(hostname: string): boolean {
  return getHostname(hostname) === PORTAL_DOMAIN;
}

// 判断是否为业务域名（即非门户域名）
function isBusinessDomain(hostname: string): boolean {
  return !isPortalDomain(hostname);
}

// 处理业务域名的根路径请求 - 重定向到门户域名
function handleBusinessDomainRedirect(hostname: string): NextResponse {
  const portalUrl = `https://${PORTAL_DOMAIN}?redirect=${hostname}`;
  return NextResponse.redirect(portalUrl, 302);
}

async function handleShortUrl(req: NextAuthRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const isSystemRoute = systemRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isSystemRoute || pathname === "/") {
    return NextResponse.next();
  }

  // 兼容旧版 /s
  if (pathname.startsWith("/s/")) {
    const slug = extractSlug(req.url);
    const newUrl = new URL(`/${slug}`, siteConfig.url);
    url.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(newUrl.toString(), 302);
  }

  const slug = pathname.substring(1);

  if (!slug || slug.includes("/")) {
    return NextResponse.next();
  }

  const slugRegex = /^[a-zA-Z0-9_-]+$/;
  if (!slugRegex.test(slug)) {
    return NextResponse.next();
  }

  return await processShortUrl(req, slug, url);
}

async function processShortUrl(req: NextAuthRequest, slug: string, url: URL) {
  const headers = req.headers;
  const ip = isVercel ? ipAddress(req) : extractRealIP(headers);
  const ua = getUserAgent(req);

  const geo = await getGeolocation(req, ip || "::1");

  const password = url.searchParams.get("password") || "";

  const trackingData = {
    slug,
    referer: headers.get("referer") || "(None)",
    ip,
    city: geo?.city,
    region: geo?.region,
    country: geo?.country,
    latitude: geo?.latitude,
    longitude: geo?.longitude,
    flag: geo?.flag,
    lang: headers.get("accept-language")?.split(",")[0] || "Unknown",
    device: ua.device.model || "Unknown",
    browser: ua.browser.name || "Unknown",
    engine: ua.engine.name || "",
    os: ua.os.name || "",
    cpu: ua.cpu.architecture || "",
    isBot: ua.isBot,
    password,
  };

  // console.log("Tracking data:", trackingData, siteConfig.url);

  const res = await fetch(`${siteConfig.url}/api/s`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trackingData),
  });

  if (!res.ok)
    return NextResponse.redirect(
      `${siteConfig.url}${redirectMap["Error[0003]"]}${slug}`,
      302,
    );

  const target = await res.json();

  if (!target || typeof target !== "string") {
    return NextResponse.redirect(
      `${siteConfig.url}${redirectMap["Error[0003]"]}${slug}`,
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
      `${siteConfig.url}${redirectMap[target]}${slug}`,
      302,
    );
  }

  return NextResponse.redirect(target, 302);
}

function extractSlug(url: string): string | null {
  const match = url.match(/\/s\/([^/?]+)(?:\?.*)?$/);
  return match ? match[1] : null;
}

export default auth(async (req) => {
  try {
    const { pathname } = new URL(req.nextUrl);
    const hostname = req.headers.get("host") || "";
    if (isBusinessDomain(hostname) && pathname === "/") {
      return handleBusinessDomainRedirect(hostname);
    }
    return await handleShortUrl(req);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(siteConfig.url, 302);
  }
});
