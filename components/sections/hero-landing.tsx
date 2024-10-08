import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-24">
      <div className="container flex max-w-screen-md flex-col items-center gap-5 text-center">
        <Link
          href="https://wr.do"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "xl" }),
            "px-4",
          )}
        >
          <span className="mr-3">🎉</span>Apply to join&nbsp;
          <span className="font-bold" style={{ fontFamily: "Bahamas Bold" }}>
            WR.DO
          </span>
          &nbsp;now!
        </Link>

        <h1 className="text-balance font-satoshi text-[40px] font-black leading-[1.15] tracking-tight sm:text-5xl md:text-6xl md:leading-[1.15]">
          Create Your Short Domains{" "}
          <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            In Seconds
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-muted-foreground sm:text-lg">
          Free domain name distribution and short url generation <br />{" "}
          platform, build with cloudflare.
        </p>

        <div className="flex justify-center space-x-2">
          <Link
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: "outline",
                rounded: "xl",
                size: "lg",
                className: "bg-primary-foreground hover:opacity-70",
              }),
              "px-4 text-[15px]",
            )}
          >
            <Icons.bookOpen className="mr-2 size-4" />
            <p>Documents</p>
          </Link>
          <Link
            href="/dashboard"
            prefetch={true}
            className={cn(
              buttonVariants({ rounded: "xl", size: "lg" }),
              "gap-2 px-5 text-[15px]",
            )}
          >
            <span>Apply</span>
            <Icons.arrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
