const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  redirects() {
    return [
      {
        source: "/s",
        destination: "/",
        permanent: true,
      },
      {
        source: "/0",
        destination: "https://www.oiov.dev",
        permanent: true,
      },
      {
        source: "/9",
        destination: "https://f8dd841.webp.li/IMG20240703084254.jpg",
        permanent: true,
      },
      {
        source: "/ai",
        destination: "https://oi.sorapi.dev/?ref=wrdo",
        permanent: true,
      },
      {
        source: "/cps",
        destination:
          "https://u3b6zhbgfp.feishu.cn/docx/OfHyd7LG5o0UJFx0xIdc0FYjnSf?from=wrdo",
        permanent: true,
      },
      {
        source: "/x",
        destination: "https://x.com/yesmoree",
        permanent: true,
      },
      {
        source: "/solo",
        destination: "https://solo.oiov.dev",
        permanent: true,
      },
      {
        source: "/rmbg",
        destination: "https://remover.wr.do",
        permanent: true,
      },
      {
        source: "/llk",
        destination: "https://www.oiov.dev/blog/llk",
        permanent: true,
      },
    ];
  },
};

module.exports = withContentlayer(nextConfig);
