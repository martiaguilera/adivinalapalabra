"use client";

import { useEffect, useState, useCallback } from "react";
import { getDailyWord, getTodayString } from "@/lib/dailyWord";
import { computeScoreAI, getDirection, normalize } from "@/lib/scoring";
import {
  loadGameState,
  saveGameState,
  clearGameState,
  Attempt,
} from "@/lib/storage";
import { WordInput } from "@/components/WordInput";
import { AttemptList } from "@/components/AttemptList";
import { VictoryModal } from "@/components/VictoryModal";

export default function GamePage() {
  const [dateStr] = useState(getTodayString);
  const [daily] = useState(() => getDailyWord());
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [won, setWon] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadGameState();
    if (saved) {
      setAttempts(saved.attempts);
      setWon(saved.won);
    }
    setMounted(true);
  }, []);

  const handleGuess = useCallback(
    async (word: string) => {
      const normTarget = normalize(daily.word);
      const normGuess = normalize(word);

      // Don't allow duplicate attempts
      const isDuplicate = attempts.some((a) => normalize(a.word) === normGuess);
      if (isDuplicate) return;

      setLoading(true);
      const score =
        normGuess === normTarget ? 100 : await computeScoreAI(word, daily.word);
      setLoading(false);

      const prevScore =
        attempts.length > 0 ? attempts[attempts.length - 1].score : null;
      const direction = getDirection(score, prevScore);
      const isWin = score === 100;

      const newAttempt: Attempt = { word, score, direction };
      const newAttempts = [...attempts, newAttempt];

      setAttempts(newAttempts);
      if (isWin) setWon(true);

      saveGameState({
        date: dateStr,
        attempts: newAttempts,
        won: isWin || won,
      });
    },
    [attempts, daily.word, dateStr, won]
  );

  const handleRestart = useCallback(() => {
    clearGameState();
    setAttempts([]);
    setWon(false);
  }, []);

  const themeEmojis: Record<string, string> = {
    Animales: "🐾",
    Deportes: "⚽",
    Cine: "🎬",
    Cocina: "🍽️",
    Música: "🎵",
    Ciencia: "🔬",
    Tecnología: "💻",
    Naturaleza: "🌿",
    Historia: "📜",
    Arte: "🎨",
    Geografía: "🌍",
  };

  const themeEmoji = themeEmojis[daily.theme] ?? "🔤";
  const bestScore =
    attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d0820] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0820] text-white">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-12">
        {/* Header */}
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/40 mb-3 font-mono">
            📅 {dateStr}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Adivina la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              Palabra
            </span>
          </h1>
        </header>

        {/* Theme card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
              Tema del día
            </div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              {themeEmoji} {daily.theme}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">
              Intentos
            </div>
            <div className="text-2xl font-bold text-white">
              {attempts.length}
            </div>
          </div>
        </div>

        {/* Best score progress */}
        {attempts.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/40 uppercase tracking-wider">
                Mejor puntuación
              </span>
              <span className="text-sm font-bold text-white">
                {bestScore}%
              </span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-700"
                style={{ width: `${bestScore}%` }}
              />
            </div>
            {bestScore >= 70 && !won && (
              <p className="text-xs text-violet-300 mt-1.5 text-center animate-pulse">
                ¡Estás muy cerca! 🔥
              </p>
            )}
          </div>
        )}

        {/* Input */}
        {!won && (
          <div className="mb-4">
            <label
              htmlFor="word-input"
              className="block text-xs text-white/40 uppercase tracking-wider mb-2"
            >
              Tu intento
            </label>
            <WordInput onSubmit={handleGuess} disabled={won || loading} />
            {loading && (
              <div className="flex items-center gap-2 mt-2 text-xs text-violet-300 animate-pulse">
                <div className="w-3 h-3 rounded-full border border-violet-400 border-t-transparent animate-spin" />
                Consultando IA semántica2026
              </div>
            )}
          </div>
        )}

        {/* Restart button */}
        {attempts.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={handleRestart}
              className="text-xs text-white/30 hover:text-white/60 transition-colors focus:outline-none focus:underline"
            >
              ↺ Nueva partida
            </button>
          </div>
        )}

        {/* Attempts list */}
        <AttemptList attempts={attempts} />

        {/* Hint */}
        {attempts.length === 0 && (
          <div className="mt-6 text-center text-white/20 text-xs leading-relaxed">
            Escribe cualquier palabra en español.<br />
            Recibirás una puntuación de cercanía del 0% al 100%.
          </div>
        )}
      </div>

      {/* Victory modal */}
      {won && (
        <VictoryModal
          word={daily.word}
          attempts={attempts}
          dateStr={dateStr}
          onRestart={handleRestart}
        />
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
