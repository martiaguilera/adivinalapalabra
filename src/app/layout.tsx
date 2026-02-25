import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adivina la Palabra",
  description:
    "Adivina la palabra del día con pistas de cercanía. Un reto nuevo cada día.",
  keywords: ["wordle", "español", "adivina", "palabra", "juego"],
  openGraph: {
    title: "Adivina la Palabra",
    description: "Adivina la palabra del día. Un reto nuevo cada día en español.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
