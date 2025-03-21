import { NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { auth } from "auth";
import UAParser from "ua-parser-js";

import { siteConfig } from "./config/site";
// import { trackUmamiEvent } from "./lib/umami";

// export { auth as middleware } from "auth";

export default auth(async (req) => {
  // console.log(req.auth);
  try {
    const ip = req.headers.get("X-Forwarded-For");
    if (req.url.includes("/s/")) {
      const match = req.url.match(/([^/?]+)(?:\?.*)?$/);

      if (match) {
        const geo = geolocation(req);
        const userLanguage = req.headers.get("accept-language")?.split(",")[0];

        const ua = req.headers.get("user-agent") || "";
        const parser = new UAParser();
        parser.setUA(ua);
        const browser = parser.getBrowser();
        const device = parser.getDevice();

        const referer = req.headers.get("referer") || "(None)";
        const slug = match[1];

        const res = await fetch(`${siteConfig.url}/api/s`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            referer,
            ip,
            city: geo?.city,
            region: geo?.region,
            country: geo?.country,
            latitude: geo?.latitude,
            longitude: geo?.longitude,
            flag: geo?.flag,
            lang: userLanguage,
            device: device.model || "Unknown",
            browser: browser.name || "Unknown",
          }),
        });

        if (!res.ok) {
          return NextResponse.redirect(
            `${siteConfig.url}/docs/short-urls`,
            302,
          );
        }

        const target = await res.json();
        if (!target) {
          return NextResponse.redirect(
            `${siteConfig.url}/docs/short-urls`,
            302,
          );
        }
        return NextResponse.redirect(target, 302);
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(siteConfig.url, 302);
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
