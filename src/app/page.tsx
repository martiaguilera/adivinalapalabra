"use client";

import { useEffect, useState, useCallback } from "react";
import { generateWordAI, DailyWord } from "@/lib/wordGenerator";
import { computeScoreAI, getDirection, normalize } from "@/lib/scoring";
import { loadGameState, saveGameState, clearCurrentGame, loadSolvedWords, Attempt, SolvedWord } from "@/lib/storage";
import { WordInput } from "@/components/WordInput";
import { AttemptList } from "@/components/AttemptList";
import { VictoryModal } from "@/components/VictoryModal";
import { SolvedWordsSidebar } from "@/components/SolvedWordsSidebar";

const themeEmojis: Record<string, string> = {
  Animales:"🐾", Deportes:"⚽", Cine:"🎬", Cocina:"🍽️", Música:"🎵",
  Ciencia:"🔬", Tecnología:"💻", Naturaleza:"🌿", Historia:"📜", Arte:"🎨",
  Geografía:"🌍", Literatura:"📚", Viajes:"✈️", Arquitectura:"🏛️", Mitología:"⚡",
};

function getTodayString() {
  return new Date().toLocaleDateString("es-ES", { year:"numeric", month:"2-digit", day:"2-digit" });
}

export default function GamePage() {
  const [dateStr] = useState(getTodayString);
  const [daily, setDaily] = useState<DailyWord | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [won, setWon] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [generatingWord, setGeneratingWord] = useState(true);
  const [scoringLoading, setScoringLoading] = useState(false);
  const [solvedWords, setSolvedWords] = useState<SolvedWord[]>([]);
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const generateNew = useCallback(async (currentSolved?: SolvedWord[]) => {
    const solved = currentSolved ?? solvedWords;
    setGeneratingWord(true);
    clearCurrentGame(solved);
    setAttempts([]);
    setWon(false);
    setRevealed(false);
    setShowRevealConfirm(false);
    const newWord = await generateWordAI();
    setDaily(newWord);
    setGeneratingWord(false);
  }, [solvedWords]);

  useEffect(() => {
    const saved = loadGameState();
    const savedSolved = loadSolvedWords();
    setSolvedWords(savedSolved);
    if (saved && saved.daily) {
      setDaily(saved.daily);
      setAttempts(saved.attempts ?? []);
      setWon(saved.won ?? false);
      setRevealed(saved.revealed ?? false);
      setGeneratingWord(false);
    } else {
      generateNew(savedSolved);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = useCallback(async (word: string) => {
    if (!daily || generatingWord || revealed || won) return;
    const normTarget = normalize(daily.word);
    const normGuess = normalize(word);
    if (attempts.some((a) => normalize(a.word) === normGuess)) return;

    setScoringLoading(true);
    const score = normGuess === normTarget ? 100 : await computeScoreAI(word, daily.word);
    setScoringLoading(false);

    const prevScore = attempts.length > 0 ? attempts[attempts.length - 1].score : null;
    const direction = getDirection(score, prevScore);
    const isWin = score === 100;

    // Sort attempts by score desc
    const newAttempts = [...attempts, { word, score, direction }]
      .sort((a, b) => b.score - a.score);

    setAttempts(newAttempts);

    if (isWin) {
      setWon(true);
      const newSolved: SolvedWord = {
        word: daily.word, theme: daily.theme,
        attempts: newAttempts.length, revealed: false, date: Date.now(),
      };
      const newSolvedWords = [newSolved, ...solvedWords];
      setSolvedWords(newSolvedWords);
      saveGameState({ date: dateStr, daily, attempts: newAttempts, won: true, revealed: false, solvedWords: newSolvedWords });
    } else {
      saveGameState({ date: dateStr, daily, attempts: newAttempts, won: false, revealed: false, solvedWords });
    }
  }, [attempts, daily, dateStr, generatingWord, revealed, won, solvedWords]);

  const handleReveal = useCallback(() => {
    if (!daily || won || revealed) return;
    setShowRevealConfirm(false);
    setRevealed(true);
    const newSolved: SolvedWord = {
      word: daily.word, theme: daily.theme,
      attempts: attempts.length, revealed: true, date: Date.now(),
    };
    const newSolvedWords = [newSolved, ...solvedWords];
    setSolvedWords(newSolvedWords);
    saveGameState({ date: dateStr, daily, attempts, won: false, revealed: true, solvedWords: newSolvedWords });
  }, [daily, won, revealed, attempts, solvedWords, dateStr]);

  const handleNextWord = useCallback(() => {
    generateNew(solvedWords);
  }, [generateNew, solvedWords]);

  const themeEmoji = daily ? (themeEmojis[daily.theme] ?? "🔤") : "🔤";
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;
  const blocked = won || revealed;

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
      </div>

      {/* Desktop layout */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar - desktop */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto p-4">
            <SolvedWordsSidebar solvedWords={solvedWords} />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 max-w-lg mx-auto px-4 py-6 pb-12">

          {/* Header */}
          <header className="text-center mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9" />
              <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/40 font-mono">
                📅 {dateStr} <span className="text-violet-400">✦ IA</span>
              </div>
              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white transition-all text-sm"
                aria-label="Ver palabras resueltas"
              >
                🏆
                {solvedWords.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                    {solvedWords.length}
                  </span>
                )}
              </button>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Adivina la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                Palabra
              </span>
            </h1>
          </header>

          {/* Theme + stats */}
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
              <button
                onClick={() => generateNew()}
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
              {bestScore >= 70 && !blocked && (
                <p className="text-xs text-violet-300 mt-1.5 text-center animate-pulse">¡Estás muy cerca! 🔥</p>
              )}
            </div>
          )}

          {/* Revealed word banner */}
          {revealed && daily && (
            <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-4 mb-4 text-center">
              <div className="text-amber-300 text-xs uppercase tracking-wider mb-1">Palabra revelada</div>
              <div className="text-2xl font-black text-amber-200 capitalize">{daily.word}</div>
              <button
                onClick={handleNextWord}
                className="mt-3 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all active:scale-95"
              >
                ▶ Siguiente palabra
              </button>
            </div>
          )}

          {/* Input + reveal button */}
          {!blocked && (
            <div className="mb-4 space-y-2">
              <label htmlFor="word-input" className="block text-xs text-white/40 uppercase tracking-wider">
                Tu intento
              </label>
              <WordInput onSubmit={handleGuess} disabled={scoringLoading} />
              {scoringLoading && (
                <div className="flex items-center gap-2 mt-2 text-xs text-violet-300 animate-pulse">
                  <div className="w-3 h-3 rounded-full border border-violet-400 border-t-transparent animate-spin" />
                  Consultando IA semántica…
                </div>
              )}
              {/* Reveal button */}
              {!showRevealConfirm ? (
                <button
                  onClick={() => setShowRevealConfirm(true)}
                  disabled={scoringLoading}
                  className="w-full mt-1 bg-white/5 hover:bg-amber-500/15 border border-white/10 hover:border-amber-400/30 text-white/40 hover:text-amber-300 text-xs font-medium py-2 rounded-xl transition-all disabled:opacity-30"
                >
                  👁 Revelar palabra (me rindo)
                </button>
              ) : (
                <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-3 text-center">
                  <p className="text-amber-200 text-xs mb-2">¿Seguro que quieres revelar la palabra?</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleReveal}
                      className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
                    >
                      Sí, revelar
                    </button>
                    <button
                      onClick={() => setShowRevealConfirm(false)}
                      className="bg-white/10 hover:bg-white/15 text-white/60 text-xs px-4 py-1.5 rounded-lg transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <AttemptList attempts={attempts} />

          {attempts.length === 0 && !blocked && (
            <div className="mt-6 text-center text-white/20 text-xs leading-relaxed">
              Escribe cualquier palabra en español.<br />
              Recibirás una puntuación de cercanía del 0% al 100%.<br />
              Los intentos se ordenan de más caliente a más frío.
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-[#120d25] border-l border-white/10 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Palabras resueltas</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white text-xl">✕</button>
            </div>
            <SolvedWordsSidebar solvedWords={solvedWords} />
          </div>
        </div>
      )}

      {won && daily && (
        <VictoryModal
          word={daily.word}
          attempts={attempts}
          dateStr={dateStr}
          onRestart={() => generateNew()}
          onNextWord={handleNextWord}
        />
      )}

      <style jsx global>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
