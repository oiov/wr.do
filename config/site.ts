import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;
const free_recored_quota = env.NEXT_PUBLIC_FREE_RECORD_QUOTA;
const free_url_quota = env.NEXT_PUBLIC_FREE_URL_QUOTA;
const open_signup = env.NEXT_PUBLIC_OPEN_SIGNUP;
const short_domains = env.NEXT_PUBLIC_SHORT_DOMAINS || "";
const email_r2_domain = env.NEXT_PUBLIC_EMAIL_R2_DOMAIN || "";

export const siteConfig: SiteConfig = {
  name: "WR.DO",
  description: "A DNS record distribution system",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/yesmoree",
    github: "https://github.com/oiov/wr.do",
    discord: "https://wr.do/s/discord",
  },
  mailSupport: "support@wr.do",
  freeQuota: {
    record: Number(free_recored_quota),
    url: Number(free_url_quota),
  },
  openSignup: open_signup === "1" ? true : false,
  shortDomains: short_domains.split(","),
  emailR2Domain: email_r2_domain,
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/docs" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
      { title: "Blog", href: "https://www.oiov.dev" },
    ],
  },
  {
    title: "Products",
    items: [
      { title: "Vmail", href: "https://vmail.dev" },
      { title: "Moise", href: "https://moise.oiov.dev" },
      // { title: "Inke", href: "https://inke.wr.do" },
      { title: "Iconce", href: "https://iconce.com" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Guide", href: "/docs/quick-start" },
      { title: "Developer", href: "/docs/developer" },
      { title: "Contact", href: "mailto:support@wr.do" },
    ],
  },
];
