import { MarketingConfig } from "types";

import { siteConfig } from "./site";

export const marketingConfig: MarketingConfig = {
  mainNav: [
    {
      title: "OiChat",
      href: siteConfig.links.oichat,
    },
    {
      title: "Docs",
      href: "/docs",
    },
    {
      title: "Feedback",
      href: siteConfig.links.feedback,
    },
    {
      title: "Discord",
      href: "https://discord.gg/AHPQYuZu3m",
    },
    {
      title: "Pricing",
      href: "#pricing",
    },
  ],
};
