"use client";

import { Attempt } from "@/lib/storage";
import { ScoreBar } from "./ScoreBar";

const directionConfig = {
  closer: {
    emoji: "🔥",
    label: "Más cerca",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
  },
  farther: {
    emoji: "❄️",
    label: "Más lejos",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
  },
  same: {
    emoji: "➡️",
    label: "Igual",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/30",
  },
};

interface AttemptListProps {
  attempts: Attempt[];
}

export function AttemptList({ attempts }: AttemptListProps) {
  if (attempts.length === 0) {
    return (
      <div className="text-center text-white/30 py-8 text-sm italic">
        Escribe tu primer intento arriba ↑
      </div>
    );
  }

  // Sort hottest → coldest
  const sorted = [...attempts].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center gap-2 mb-1 px-1">
        <span className="text-xs text-white/30 uppercase tracking-wider">
          {attempts.length} intento{attempts.length !== 1 ? "s" : ""} · ordenados por puntuación
        </span>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {sorted.map((attempt, idx) => {
        const config = directionConfig[attempt.direction];
        return (
          <div
            key={`${attempt.word}-${idx}`}
            className={`border rounded-xl px-4 py-3 ${config.bg} transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono w-5 text-center ${idx === 0 ? "text-amber-400" : "text-white/25"}`}>
                  {idx === 0 ? "★" : `${idx + 1}`}
                </span>
                <span className="font-semibold text-white capitalize">
                  {attempt.word}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${config.color}`}>
                  {config.emoji} {config.label}
                </span>
                <span className="text-white font-bold text-sm min-w-[36px] text-right">
                  {attempt.score}%
                </span>
              </div>
            </div>
            <ScoreBar score={attempt.score} />
          </div>
        );
      })}
    </div>
  );
}
