import { DocsConfig } from "types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Blog",
      href: "/blog",
    },
  ],
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
          title: "Installation",
          href: "/docs/installation",
          icon: "page",
        },
      ],
    },
    {
      title: "Configuration",
      items: [
        {
          title: "Authentification",
          href: "/docs/configuration/authentification",
          icon: "page",
        },
        {
          title: "Blog",
          href: "/docs/configuration/blog",
          icon: "page",
        },
        {
          title: "Components",
          href: "/docs/configuration/components",
          icon: "page",
        },
        {
          title: "Config files",
          href: "/docs/configuration/config-files",
          icon: "page",
        },
        {
          title: "Database",
          href: "/docs/configuration/database",
          icon: "page",
        },
        {
          title: "Email",
          href: "/docs/configuration/email",
          icon: "page",
        },
        {
          title: "Layout Options",
          href: "/docs/configuration/layouts",
          icon: "page",
        },
        {
          title: "Markdown files",
          href: "/docs/configuration/markdown-files",
          icon: "page",
        },
      ],
    },
  ],
};
