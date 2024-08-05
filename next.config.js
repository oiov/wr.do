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
        source: "/docs/developer",
        destination: "/docs/developer/installation",
        permanent: true,
      },
      {
        source: "/0",
        destination: "https://wr.do/s/0",
        permanent: true,
      },
      {
        source: "/9",
        destination: "https://wr.do/s/9",
        permanent: true,
      },
      {
        source: "/ai",
        destination: "https://wr.do/s/ai?ref=wrdo",
        permanent: true,
      },
      {
        source: "/cps",
        destination: "https://wr.do/s/cps",
        permanent: true,
      },
      {
        source: "/x",
        destination: "https://wr.do/s/x",
        permanent: true,
      },
      {
        source: "/solo",
        destination: "https://wr.do/s/solo",
        permanent: true,
      },
      {
        source: "/rmbg",
        destination: "https://wr.do/s/rmbg",
        permanent: true,
      },
      {
        source: "/llk",
        destination: "https://wr.do/s/llk",
        permanent: true,
      },
    ];
  },
};

module.exports = withContentlayer(nextConfig);
