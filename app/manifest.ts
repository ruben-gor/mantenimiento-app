import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mantenimiento · Incidencias",
    short_name: "Mantenimiento",
    description: "Registro de incidencias de mantenimiento de un hotel",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f5f8",
    theme_color: "#2457d6",
    lang: "es",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
