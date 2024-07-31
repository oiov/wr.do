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
        // {
        //   title: "Terms of Service",
        //   href: "/terms",
        //   icon: "page",
        // },
        // {
        //   title: "Privacy Policy",
        //   href: "/privacy",
        //   icon: "page",
        // },
        // {
        //   title: "Newsletter",
        //   href: "/docs/newsletter",
        //   icon: "page",
        // },
      ],
    },
    {
      title: "Examples",
      items: [
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
