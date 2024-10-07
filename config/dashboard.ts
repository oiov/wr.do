import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

import { siteConfig } from "./site";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/dashboard/records", icon: "globeLock", title: "DNS Records" },
      { href: "/dashboard/urls", icon: "link", title: "Short Urls" },
      { href: "/dashboard/scrape", icon: "bug", title: "Scraping API" },
    ],
  },
  {
    title: "ADMIN",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/users",
        icon: "users",
        title: "Users",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/records",
        icon: "globe",
        title: "Records",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/urls",
        icon: "link",
        title: "URLs",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "settings", title: "Settings" },
      { href: "/", icon: "home", title: "Homepage" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
      { href: siteConfig.links.github, icon: "github", title: "Github" },
      {
        href: "mailto:" + siteConfig.mailSupport,
        icon: "mail",
        title: "Support",
        // authorizeOnly: UserRole.USER,
        // disabled: true,
      },
    ],
  },
];
