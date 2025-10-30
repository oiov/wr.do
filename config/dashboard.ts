import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

import { siteConfig } from "./site";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
      {
        href: "",
        icon: "link",
        title: "Short Urls",
        items: [
          { href: "/dashboard/urls", title: "Links" },
          { href: "/dashboard/urls/analytics", title: "Analytics" },
          { href: "/dashboard/urls/logs", title: "Ip Logs" },
          { href: "/dashboard/urls/api", title: "API" },
        ],
      },
      { href: "/dashboard/records", icon: "globe", title: "DNS Records" },
      {
        href: "",
        icon: "mail",
        title: "Emails",
        items: [
          { href: "/emails", title: "Inbox" },
          { href: "/emails/sent", title: "Sent" },
          { href: "/emails/trash", title: "Trash", disabled: true },
          { href: "/emails/api", title: "API", disabled: true },
        ],
      },
      {
        href: "",
        icon: "storage",
        title: "Cloud Storage",
        items: [
          { href: "/dashboard/storage", title: "Storage" },
          {
            href: "/dashboard/storage/analytics",
            title: "File Analytics",
            disabled: true,
          },
          { href: "/dashboard/storage/api", title: "API", disabled: true },
        ],
      },
    ],
  },
  {
    title: "OPEN API",
    items: [
      {
        href: "/dashboard/scrape",
        icon: "layers",
        title: "Overview",
      },
      {
        href: "",
        icon: "bug",
        title: "APIs",
        items: [
          {
            href: "/dashboard/scrape/screenshot",
            title: "Screenshot",
          },
          {
            href: "/dashboard/scrape/qrcode",
            title: "QR Code",
          },
          {
            href: "/dashboard/scrape/meta-info",
            title: "Meta Info",
          },
          {
            href: "/dashboard/scrape/markdown",
            title: "Markdown",
          },
        ],
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
        href: "/admin/resources",
        icon: "boxes",
        title: "Resources",
        authorizeOnly: UserRole.ADMIN,
        items: [
          {
            href: "",
            title: "URLs",
            authorizeOnly: UserRole.ADMIN,
            items: [
              {
                href: "/admin/urls",
                title: "List",
                authorizeOnly: UserRole.ADMIN,
              },
              {
                href: "/admin/urls/analytics",
                title: "Analytics",
                authorizeOnly: UserRole.ADMIN,
              },
              {
                href: "/admin/urls/logs",
                title: "Ip Logs",
                authorizeOnly: UserRole.ADMIN,
              },
            ],
          },
          // {
          //   href: "/admin/emails",
          //   // icon: "globe",
          //   title: "Emails",
          //   authorizeOnly: UserRole.ADMIN,
          //   items: [
          //     {
          //       href: "/admin/emails/sent",
          //       title: "Sent",
          //       authorizeOnly: UserRole.ADMIN,
          //     },
          //     {
          //       href: "/admin/emails/trash",
          //       title: "Trash",
          //       authorizeOnly: UserRole.ADMIN,
          //       disabled: true,
          //     },
          //   ],
          // },
          {
            href: "/admin/records",
            // icon: "globe",
            title: "Records",
            authorizeOnly: UserRole.ADMIN,
          },
          {
            href: "/admin/storage",
            // icon: "storage",
            title: "Cloud Storage Manage",
            authorizeOnly: UserRole.ADMIN,
          },
        ],
      },
      {
        href: "",
        icon: "settings",
        title: "System Settings",
        authorizeOnly: UserRole.ADMIN,
        items: [
          {
            href: "/admin/system",
            title: "App Configs",
            authorizeOnly: UserRole.ADMIN,
          },
          {
            href: "/admin/system/domains",
            title: "Domains",
            authorizeOnly: UserRole.ADMIN,
          },
          {
            href: "/admin/system/plans",
            title: "Plans",
            authorizeOnly: UserRole.ADMIN,
          },
        ],
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
