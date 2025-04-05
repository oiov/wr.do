import { DocsConfig } from "types";

export const docsConfig: DocsConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          icon: "page",
        },
        {
          title: "Quick Start",
          href: "/docs/quick-start",
          icon: "page",
        },
        {
          title: "DNS Records",
          href: "/docs/dns-records",
          icon: "page",
        },
        {
          title: "Short URLs",
          href: "/docs/short-urls",
          icon: "page",
        },
        {
          title: "Emails",
          href: "/docs/emails",
          icon: "page",
        },
      ],
    },
    {
      title: "Open API",
      items: [
        {
          title: "Overview",
          href: "/docs/open-api",
          icon: "page",
        },
        {
          title: "Screenshot API",
          href: "/docs/open-api/screenshot",
          icon: "page",
        },
        {
          title: "Meta Scraping API",
          href: "/docs/open-api/meta-info",
          icon: "page",
        },
        {
          title: "Url to Markdown API",
          href: "/docs/open-api/markdown",
          icon: "page",
        },
        {
          title: "Url to Text API",
          href: "/docs/open-api/text",
          icon: "page",
        },
        {
          title: "Url to QR Code API",
          href: "/docs/open-api/qrcode",
          icon: "page",
        },
        {
          title: "Svg Icon API",
          href: "/docs/open-api/icon",
          icon: "page",
        },
      ],
    },
    {
      title: "Examples",
      items: [
        {
          title: "Cloudflare Custom Domain",
          href: "/docs/examples/cloudflare",
          icon: "page",
        },
        {
          title: "Vercel Custom Domain",
          href: "/docs/examples/vercel",
          icon: "page",
        },
        {
          title: "Zeabur Custom Domain",
          href: "/docs/examples/zeabur",
          icon: "page",
        },
        {
          title: "Other Platforms",
          href: "/docs/examples/other",
          icon: "page",
        },
      ],
    },
    {
      title: "Developer",
      items: [
        {
          title: "Installation",
          href: "/docs/developer/installation",
          icon: "page",
        },
        {
          title: "Cloudflare",
          href: "/docs/developer/cloudflare",
          icon: "page",
        },
        {
          title: "Authentification",
          href: "/docs/developer/authentification",
          icon: "page",
        },
        {
          title: "Email",
          href: "/docs/developer/email",
          icon: "page",
        },
        {
          title: "Email Worker",
          href: "/docs/developer/cloudflare-email-worker",
          icon: "page",
        },
        {
          title: "Database",
          href: "/docs/developer/database",
          icon: "page",
        },
        {
          title: "Components",
          href: "/docs/developer/components",
          icon: "page",
        },
        {
          title: "Config files",
          href: "/docs/developer/config-files",
          icon: "page",
        },
        {
          title: "Markdown files",
          href: "/docs/developer/markdown-files",
          icon: "page",
        },
      ],
    },
  ],
};
