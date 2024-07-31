import { NextResponse } from "next/server";
import { auth } from "auth";

import { siteConfig } from "./config/site";

// export { auth as middleware } from "auth";

export default auth(async (req) => {
  // console.log(req.auth);
  try {
    const ip = req.headers.get("X-Forwarded-For");
    if (req.url.includes("/s/")) {
      const match = req.url.match(/[^/]+$/);
      let geo = {
        city: "",
        region: "",
        country: "",
        latitude: "",
        longitude: "",
      };
      const data = await fetch(`https://ip.wr.do/api?ip=${ip}`); // http://ip-api.com/json/42.48.83.141
      if (data.ok) {
        const geoData = await data.json();
        geo = {
          city: geoData.city,
          region: geoData.region,
          country: geoData.country,
          latitude: geoData.latitude,
          longitude: geoData.longitude,
        };
      }

      if (match) {
        const res = await fetch(
          `${siteConfig.url}/api/s?slug=${match[0]}&ip=${ip}&city=${geo.city}&region=${geo.region}&country=${geo.country}&latitude=${geo.latitude}&longitude=${geo.longitude}`,
          {
            method: "GET",
          },
        );

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
    return NextResponse.redirect(`/`);
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
