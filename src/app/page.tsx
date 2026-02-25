import type { Metadata } from "next";
import GameClient from "@/components/GameClient";

export const metadata: Metadata = {
  title: "Adivina la Palabra – Juego de Palabras Semántico con IA en Español",
  description:
    "¿Puedes adivinar la palabra secreta? Escribe palabras en español y recibe pistas de similitud semántica con inteligencia artificial. Gratis, sin registro, infinitas partidas.",
  alternates: { canonical: "https://www.adivinalapalabra.com" },
};

export default function Home() {
  return <GameClient />;
}
