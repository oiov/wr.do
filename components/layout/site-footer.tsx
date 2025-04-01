import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

// import { NewsletterForm } from "../forms/newsletter-form";
import GitHubStarsWithSuspense from "../shared/github-star-wrapper";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
        <div className="col-span-full flex flex-col items-start sm:col-span-1 md:col-span-2">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-1.5">
              <Icons.logo />
              <h1
                style={{ fontFamily: "Bahamas Bold" }}
                className="text-2xl font-bold"
              >
                {siteConfig.name}
              </h1>
            </Link>
          </div>
          <div className="mt-4 text-sm">
            Craft DNS Records, Make Short Links. <br />
            Powerful Screenshot and Meta Scraping API.
            <br /> Open source.
          </div>
          <GitHubStarsWithSuspense className="mt-4" owner="oiov" repo="wr.do" />
        </div>
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          <p className="font-mono text-sm text-muted-foreground/70">
            &copy; 2024{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              oiov
            </Link>
            . <br className="block sm:hidden" /> Built with{" "}
            <Link
              href="https://www.cloudflare.com?ref=wrdo"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              Cloudflare
            </Link>
            .
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-1"
            >
              <Icons.github className="size-5" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
