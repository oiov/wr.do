const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
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
      {
        protocol: "https",
        hostname: "email-attachment.socio.site",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "socio.site",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  rewrites() {
    return [
      {
        source: "/logo.png",
        destination: "/_static/logo.png",
      },
    ];
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
        destination: "https://socio.site/s/0",
        permanent: true,
      },
      {
        source: "/9",
        destination: "https://socio.site/s/9",
        permanent: true,
      },
      {
        source: "/ai",
        destination: "https://socio.site/s/ai?ref=wrdo",
        permanent: true,
      },
      {
        source: "/cps",
        destination: "https://socio.site/s/cps",
        permanent: true,
      },
      {
        source: "/x",
        destination: "https://socio.site/s/x",
        permanent: true,
      },
      {
        source: "/solo",
        destination: "https://socio.site/s/solo",
        permanent: true,
      },
      {
        source: "/rmbg",
        destination: "https://socio.site/s/rmbg",
        permanent: true,
      },
      {
        source: "/llk",
        destination: "https://socio.site/s/llk",
        permanent: true,
      },
    ];
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  disable: false,
});

module.exports = withContentlayer(withPWA(nextConfig));
