import { NextResponse } from "next/server";
import { auth } from "auth";

import { siteConfig } from "./config/site";
import { createUserShortUrlMeta, getUrlBySuffix } from "./lib/dto/short-urls";

// export { auth as middleware } from "auth";

// Or like this if you need to do something here.
export default auth(async (req) => {
  // console.log(req.auth); //  { session: { user: { ... } } }
  const ip = req.headers.get("X-Forwarded-For");
  // console.log("[middle/s]", ip);

  if (req.url.includes("/s/")) {
    const slugRegex = /[^/]+$/;
    const match = req.url.match(slugRegex);
    if (match) {
      const res = await fetch(
        `${siteConfig.url}/api/s?slug=${match[0]}&ip=${ip}`,
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
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
