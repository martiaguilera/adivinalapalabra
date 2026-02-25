"use client";

import { Attempt } from "@/lib/storage";
import { ScoreBar } from "./ScoreBar";

const directionConfig = {
  closer: { emoji: "🔥", label: "Más cerca", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  farther: { emoji: "❄️", label: "Más lejos", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  same: { emoji: "➡️", label: "Igual", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
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

  // Already sorted by score desc (hottest first) from page.tsx
  return (
    <div className="space-y-2 mt-4">
      {attempts.map((attempt, idx) => {
        const config = directionConfig[attempt.direction];
        const isHottest = idx === 0;
        return (
          <div
            key={`${attempt.word}-${idx}`}
            className={`border rounded-xl px-4 py-3 ${config.bg} ${isHottest ? "ring-1 ring-white/20" : ""} transition-all duration-300`}
            style={{ animation: "slideIn 0.3s ease-out" }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-white/40">#{attempts.length - idx}</span>
                <span className="font-semibold text-white capitalize">{attempt.word}</span>
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
