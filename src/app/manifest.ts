import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Comunidade Hágios",
    short_name: "Hágios",
    description:
      "Ambiente premium para empresários aplicarem inteligência artificial no negócio.",
    start_url: "/comunidade",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0d1420",
    theme_color: "#0d1420",
    categories: ["business", "education", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
