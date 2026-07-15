import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chios Commercial Divers — Service Report",
    short_name: "CD Report",
    description: "Generate boat cleaning service reports with before/after photos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8fa",
    theme_color: "#0b1e33",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
