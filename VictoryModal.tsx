"use client";

import { Attempt } from "@/lib/storage";

interface VictoryModalProps {
  word: string;
  attempts: Attempt[];
  dateStr: string;
  onRestart: () => void;
}

export function VictoryModal({
  word,
  attempts,
  dateStr,
  onRestart,
}: VictoryModalProps) {
  const buildShareText = () => {
    const dirEmoji = { closer: "🔥", farther: "❄️", same: "➡️" };
    const scoreEmoji = (score: number) => {
      if (score >= 80) return "🟩";
      if (score >= 55) return "🟨";
      if (score >= 30) return "🟧";
      return "🟥";
    };
    const lines = [
      `🔤 Adivina la Palabra – ${dateStr}`,
      `✅ Adiviné en ${attempts.length} intento${attempts.length === 1 ? "" : "s"}`,
      "",
      ...attempts.map(
        (a) => `${scoreEmoji(a.score)} ${dirEmoji[a.direction]} ${a.score}%`
      ),
      "",
      "adivinalapalabra.vercel.app",
    ];
    return lines.join("\n");
  };

  const handleShare = async () => {
    const text = buildShareText();
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("¡Resultado copiado al portapapeles!");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="¡Has ganado!"
    >
      <div className="bg-[#1a1030] border border-violet-400/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-1">
          ¡Lo conseguiste!
        </h2>
        <p className="text-white/50 text-sm mb-4">
          La palabra era{" "}
          <span className="text-violet-300 font-semibold capitalize">
            {word}
          </span>
        </p>
        <div className="bg-white/5 rounded-xl px-4 py-3 mb-5">
          <div className="text-3xl font-bold text-white mb-0.5">
            {attempts.length}
          </div>
          <div className="text-white/50 text-xs uppercase tracking-wider">
            intento{attempts.length === 1 ? "" : "s"}
          </div>
        </div>
        <div className="space-y-2">
          <button
            onClick={handleShare}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            📤 Compartir resultado
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-white/10 hover:bg-white/15 text-white/70 font-medium py-3 rounded-xl transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
          >
            Reiniciar progreso del día
          </button>
        </div>
      </div>
    </div>
  );
}
