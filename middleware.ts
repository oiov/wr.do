import { NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import { auth } from "auth";
import UAParser from "ua-parser-js";

import { siteConfig } from "./config/site";

// export { auth as middleware } from "auth";

export default auth(async (req) => {
  // console.log(req.auth);
  try {
    const ip = req.headers.get("X-Forwarded-For");
    if (req.url.includes("/s/")) {
      const match = req.url.match(/[^/]+$/);

      if (match) {
        const geo = geolocation(req);
        const userLanguage = req.headers.get("accept-language")?.split(",")[0];

        const ua = req.headers.get("user-agent");
        const parser = new UAParser();
        parser.setUA(ua);
        const browser = parser.getBrowser();
        const device = parser.getDevice();

        console.log(device, browser);

        const referer = req.headers.get("referer") || "(None)";
        // const res1 = await fetch(
        //   `${siteConfig.url}/api/s?slug=${match[0]}&referer=${referer}&ip=${ip}&city=${geo?.city}&region=${geo?.region}&country=${geo?.country}&latitude=${geo?.latitude}&longitude=${geo?.longitude}&flag=${geo?.flag}`,
        // );

        const res = await fetch(`${siteConfig.url}/api/s`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: match[0],
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
          return NextResponse.redirect(`${siteConfig.url}/docs/short-urls`);
        }

        const target = await res.json();
        if (!target) {
          return NextResponse.redirect(`${siteConfig.url}/docs/short-urls`);
        }
        return NextResponse.redirect(target);
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(siteConfig.url);
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
