import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adivina la Palabra",
  description: "Adivina la palabra con pistas de cercanía semántica. IA en español.",
  keywords: ["wordle", "español", "adivina", "palabra", "juego", "semantle"],
  openGraph: {
    title: "Adivina la Palabra",
    description: "Adivina la palabra con IA semántica. Un reto nuevo cada vez.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
