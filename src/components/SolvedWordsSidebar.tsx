"use client";

import { SolvedWord } from "@/lib/storage";

interface SolvedWordsSidebarProps {
  solvedWords: SolvedWord[];
}

const themeEmojis: Record<string, string> = {
  Animales:"🐾", Deportes:"⚽", Cine:"🎬", Cocina:"🍽️", Música:"🎵",
  Ciencia:"🔬", Tecnología:"💻", Naturaleza:"🌿", Historia:"📜", Arte:"🎨",
  Geografía:"🌍", Literatura:"📚", Viajes:"✈️", Arquitectura:"🏛️", Mitología:"⚡",
};

export function SolvedWordsSidebar({ solvedWords }: SolvedWordsSidebarProps) {
  if (solvedWords.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🏆</div>
        <p className="text-white/30 text-sm">Palabras resueltas</p>
        <p className="text-white/20 text-xs mt-1">¡Aquí aparecerán tus logros!</p>
      </div>
    );
  }

  const guessed = solvedWords.filter(w => !w.revealed).length;
  const revealed = solvedWords.filter(w => w.revealed).length;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-1">Palabras resueltas</h2>
        <div className="flex gap-3 text-xs text-white/40">
          <span>✅ {guessed} adivinadas</span>
          {revealed > 0 && <span>👁 {revealed} reveladas</span>}
        </div>
      </div>

      <div className="space-y-2">
        {solvedWords.map((sw, idx) => {
          const emoji = themeEmojis[sw.theme] ?? "🔤";
          const date = new Date(sw.date).toLocaleDateString("es-ES", { day:"2-digit", month:"2-digit" });
          return (
            <div
              key={idx}
              className={`rounded-xl p-3 border ${
                sw.revealed
                  ? "bg-amber-500/10 border-amber-400/20"
                  : "bg-emerald-500/10 border-emerald-400/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{emoji}</span>
                  <span className="font-semibold text-white capitalize text-sm">{sw.word}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  sw.revealed
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {sw.revealed ? "👁" : "✅"}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white/40 text-xs">{sw.theme}</span>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  {!sw.revealed && <span>{sw.attempts} intentos</span>}
                  <span>{date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
