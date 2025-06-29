import { NextResponse } from "next/server";
import { ipAddress } from "@vercel/functions";
import { auth } from "auth";
import { NextAuthRequest } from "next-auth/lib";

import { siteConfig } from "./config/site";
import { extractRealIP, getGeolocation, getUserAgent } from "./lib/geo";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const isVercel = process.env.VERCEL;

const redirectMap = {
  "Missing[0000]": "/link-status?error=missing&slug=",
  "Expired[0001]": "/link-status?error=expired&slug=",
  "Disabled[0002]": "/link-status?error=disabled&slug=",
  "Error[0003]": "/link-status?error=system&slug=",
  "PasswordRequired[0004]": "/password-prompt?error=0&slug=",
  "IncorrectPassword[0005]": "/password-prompt?error=1&slug=",
};

async function handleShortUrl(req: NextAuthRequest) {
  if (!req.url.includes("/s/")) return NextResponse.next();

  const slug = extractSlug(req.url);
  if (!slug)
    return NextResponse.redirect(`${siteConfig.url}/docs/short-urls`, 302);

  const headers = req.headers;
  const ip = isVercel ? ipAddress(req) : extractRealIP(headers);
  const ua = getUserAgent(req);

  const geo = await getGeolocation(req, ip || "::1");

  const url = new URL(req.url);
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
  const match = url.match(/([^/?]+)(?:\?.*)?$/);
  return match ? match[1] : null;
}

export default auth(async (req) => {
  try {
    return await handleShortUrl(req);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(siteConfig.url, 302);
  }
});
