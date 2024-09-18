import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XiHan",
    short_name: "XiHan",
    description: "我们的故事",
    start_url: "/xihan",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        src: "/_static/lover.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
  };
}
