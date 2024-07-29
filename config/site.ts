import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;
const free_recored_quota = env.NEXT_PUBLIC_FREE_RECORD_QUOTA;
const free_url_quota = env.NEXT_PUBLIC_FREE_URL_QUOTA;
const open_signup = env.NEXT_PUBLIC_OPEN_SIGNUP;

export const siteConfig: SiteConfig = {
  name: "WRDO",
  description: "A DNS record distribution system",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://twitter.com/yesmoree",
    github: "https://github.com/oiov/wr.do",
  },
  mailSupport: "support@wr.do",
  freeQuota: {
    record: Number(free_recored_quota),
    url: Number(free_url_quota),
  },
  openSignup: open_signup === "1" ? true : false,
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "/docs" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Vmail", href: "https://vmail.dev" },
      { title: "Inke", href: "https://inke.app" },
      { title: "Iconce", href: "https://iconce.com" },
    ],
  },
  {
    title: "Docs",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "How-To-Use", href: "#" },
    ],
  },
];
