import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adivina la Palabra",
    short_name: "Adivina",
    description: "Juego semántico de palabras con IA en español. Gratis y sin registro.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0820",
    theme_color: "#0d0820",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    categories: ["games", "education"],
    lang: "es",
  };
}
