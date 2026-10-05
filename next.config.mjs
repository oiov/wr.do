import { withContentlayer } from "next-contentlayer2";
import createNextIntlPlugin from "next-intl/plugin";
import nextPWA from "next-pwa";

const withNextIntl = createNextIntlPlugin();

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "unavatar.io",
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
        hostname: "email-attachment.wr.do",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "wr.do",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  rewrites() {
    return [
      {
        source: "/logo.png",
        destination: "/_static/logo-192.png",
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
        source: "/x",
        destination: "https://wr.do/s/x",
        permanent: true,
      },
    ];
  },
};

const withPWA = nextPWA({
  dest: "public",
  disable: false,
});

export default withContentlayer(withPWA(withNextIntl(nextConfig)));
