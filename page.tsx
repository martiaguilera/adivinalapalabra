"use client";

import { useEffect, useState, useCallback } from "react";
import { generateWordAI, DailyWord } from "@/lib/wordGenerator";
import { computeScoreAI, getDirection, normalize } from "@/lib/scoring";
import { loadGameState, saveGameState, clearGameState, Attempt } from "@/lib/storage";
import { WordInput } from "@/components/WordInput";
import { AttemptList } from "@/components/AttemptList";
import { VictoryModal } from "@/components/VictoryModal";
import { getTodayString } from "@/lib/dailyWord";

const themeEmojis: Record<string, string> = {
  Animales:"🐾", Deportes:"⚽", Cine:"🎬", Cocina:"🍽️", Música:"🎵",
  Ciencia:"🔬", Tecnología:"💻", Naturaleza:"🌿", Historia:"📜", Arte:"🎨",
  Geografía:"🌍", Literatura:"📚", Viajes:"✈️", Arquitectura:"🏛️", Mitología:"⚡",
};

export default function GamePage() {
  const [dateStr] = useState(getTodayString);
  const [daily, setDaily] = useState<DailyWord | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [won, setWon] = useState(false);
  const [generatingWord, setGeneratingWord] = useState(true);
  const [scoringLoading, setScoringLoading] = useState(false);

  // Generate a new word (called on mount and on "Nueva partida")
  const generateNew = useCallback(async () => {
    setGeneratingWord(true);
    clearGameState();
    setAttempts([]);
    setWon(false);
    const newWord = await generateWordAI();
    setDaily(newWord);
    setGeneratingWord(false);
  }, []);

  // On first load: try to restore saved game, else generate new word
  useEffect(() => {
    const saved = loadGameState();
    if (saved && saved.daily) {
      // Restore existing session
      setDaily(saved.daily);
      setAttempts(saved.attempts);
      setWon(saved.won);
      setGeneratingWord(false);
    } else {
      generateNew();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = useCallback(async (word: string) => {
    if (!daily || generatingWord) return;
    const normTarget = normalize(daily.word);
    const normGuess = normalize(word);
    if (attempts.some((a) => normalize(a.word) === normGuess)) return;

    setScoringLoading(true);
    const score = normGuess === normTarget ? 100 : await computeScoreAI(word, daily.word);
    setScoringLoading(false);

    const prevScore = attempts.length > 0 ? attempts[attempts.length - 1].score : null;
    const direction = getDirection(score, prevScore);
    const isWin = score === 100;
    const newAttempts = [...attempts, { word, score, direction }];

    setAttempts(newAttempts);
    if (isWin) setWon(true);
    saveGameState({ date: dateStr, daily, attempts: newAttempts, won: isWin || won });
  }, [attempts, daily, dateStr, generatingWord, won]);

  const themeEmoji = daily ? (themeEmojis[daily.theme] ?? "🔤") : "🔤";
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  // Full-screen loading while generating word
  if (generatingWord) {
    return (
      <div className="min-h-screen bg-[#0d0820] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-violet-500/30" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-white/60 text-sm font-medium">Generando palabra…</p>
          <p className="text-white/25 text-xs mt-1">La IA está pensando</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0820] text-white">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-12">

        {/* Header */}
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/40 mb-3 font-mono">
            📅 {dateStr} <span className="text-violet-400">✦ IA</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Adivina la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              Palabra
            </span>
          </h1>
        </header>

        {/* Theme + attempts */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Tema</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              {themeEmoji} {daily?.theme}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Intentos</div>
              <div className="text-2xl font-bold text-white">{attempts.length}</div>
            </div>
            {/* Nueva partida button */}
            <button
              onClick={generateNew}
              disabled={scoringLoading}
              aria-label="Nueva partida"
              title="Generar nueva palabra"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-violet-500/30 border border-white/10 hover:border-violet-400/40 text-white/50 hover:text-violet-300 transition-all disabled:opacity-30 text-base"
            >
              ↺
            </button>
          </div>
        </div>

        {/* Best score bar */}
        {attempts.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/40 uppercase tracking-wider">Mejor puntuación</span>
              <span className="text-sm font-bold text-white">{bestScore}%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-700"
                style={{ width: `${bestScore}%` }}
              />
            </div>
            {bestScore >= 70 && !won && (
              <p className="text-xs text-violet-300 mt-1.5 text-center animate-pulse">¡Estás muy cerca! 🔥</p>
            )}
          </div>
        )}

        {/* Input */}
        {!won && (
          <div className="mb-4">
            <label htmlFor="word-input" className="block text-xs text-white/40 uppercase tracking-wider mb-2">
              Tu intento
            </label>
            <WordInput onSubmit={handleGuess} disabled={scoringLoading} />
            {scoringLoading && (
              <div className="flex items-center gap-2 mt-2 text-xs text-violet-300 animate-pulse">
                <div className="w-3 h-3 rounded-full border border-violet-400 border-t-transparent animate-spin" />
                Consultando IA semántica…
              </div>
            )}
          </div>
        )}

        <AttemptList attempts={attempts} />

        {attempts.length === 0 && (
          <div className="mt-6 text-center text-white/20 text-xs leading-relaxed">
            Escribe cualquier palabra en español.<br />
            Recibirás una puntuación de cercanía del 0% al 100%.
          </div>
        )}
      </div>

      {won && daily && (
        <VictoryModal word={daily.word} attempts={attempts} dateStr={dateStr} onRestart={generateNew} />
      )}

      <style jsx global>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
