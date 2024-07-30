import { NextResponse } from "next/server";
import { auth } from "auth";

import { siteConfig } from "./config/site";
import { createUserShortUrlMeta, getUrlBySuffix } from "./lib/dto/short-urls";

// export { auth as middleware } from "auth";

// Or like this if you need to do something here.
export default auth(async (req) => {
  // console.log(req.auth); //  { session: { user: { ... } } }

  if (req.url.includes("/s/")) {
    const slugRegex = /[^/]+$/;
    const match = req.url.match(slugRegex);
    if (match) {
      const res = await fetch(`${siteConfig.url}/api/s?slug=${match[0]}`, {
        method: "GET",
      });

      if (!res.ok) {
        return NextResponse.redirect(`${siteConfig.url}`);
      }

      const target = await res.json();
      if (!target) {
        return NextResponse.redirect(`${siteConfig.url}`);
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
