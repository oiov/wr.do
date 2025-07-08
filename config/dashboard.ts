import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

import { siteConfig } from "./site";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      { href: "/dashboard/urls", icon: "link", title: "Short Urls" },
      { href: "/dashboard/records", icon: "globe", title: "DNS Records" },
      { href: "/emails", icon: "mail", title: "Emails" },
      {
        href: "/dashboard/storage",
        icon: "storage",
        title: "Cloud Storage",
      },
    ],
  },
  {
    title: "OPEN API",
    items: [
      {
        href: "/dashboard/scrape",
        icon: "bug",
        title: "Overview",
      },
      {
        href: "/dashboard/scrape/screenshot",
        icon: "camera",
        title: "Screenshot",
      },
      {
        href: "/dashboard/scrape/qrcode",
        icon: "qrcode",
        title: "QR Code",
      },
      {
        href: "/dashboard/scrape/meta-info",
        icon: "globe",
        title: "Meta Info",
      },
      {
        href: "/dashboard/scrape/markdown",
        icon: "fileText",
        title: "Markdown",
      },
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
        href: "/admin/urls",
        icon: "link",
        title: "URLs",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/records",
        icon: "globe",
        title: "Records",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/storage",
        icon: "storage",
        title: "Cloud Storage Manage",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/system",
        icon: "settings",
        title: "System Settings",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/dashboard/settings", icon: "userSettings", title: "Settings" },
      { href: "/docs", icon: "bookOpen", title: "Documentation" },
      {
        href: "/feedback",
        icon: "messageQuoted",
        title: "Feedback",
      },
      {
        href: "mailto:" + siteConfig.mailSupport,
        icon: "mail",
        title: "Support",
      },
    ],
  },
];
