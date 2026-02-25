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
  Animales: "🐾", Deportes: "⚽", Cine: "🎬", Cocina: "🍽️", Música: "🎵",
  Ciencia: "🔬", Tecnología: "💻", Naturaleza: "🌿", Historia: "📜", Arte: "🎨",
  Geografía: "🌍", Literatura: "📚", Viajes: "✈️", Arquitectura: "🏛️", Mitología: "⚡",
};

interface WonWord {
  word: string;
  theme: string;
  attempts: number;
  date: string;
}

const WON_KEY = "adivina_won_words";

function loadWonWords(): WonWord[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(WON_KEY) ?? "[]"); }
  catch { return []; }
}

function addWonWord(entry: WonWord): WonWord[] {
  const list = loadWonWords();
  if (!list.find(w => w.word === entry.word && w.date === entry.date)) {
    list.unshift(entry);
    localStorage.setItem(WON_KEY, JSON.stringify(list.slice(0, 50)));
  }
  return loadWonWords();
}

export default function GamePage() {
  const [dateStr] = useState(getTodayString);
  const [daily, setDaily] = useState<DailyWord | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [won, setWon] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [confirmReveal, setConfirmReveal] = useState(false);
  const [generatingWord, setGeneratingWord] = useState(true);
  const [scoringLoading, setScoringLoading] = useState(false);
  const [wonWords, setWonWords] = useState<WonWord[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const generateNew = useCallback(async () => {
    setGeneratingWord(true);
    clearGameState();
    setAttempts([]);
    setWon(false);
    setRevealed(false);
    setConfirmReveal(false);
    const newWord = await generateWordAI();
    setDaily(newWord);
    setGeneratingWord(false);
  }, []);

  useEffect(() => {
    setWonWords(loadWonWords());
    const saved = loadGameState();
    if (saved?.daily) {
      setDaily(saved.daily);
      setAttempts(saved.attempts);
      setWon(saved.won);
      setRevealed((saved as any).revealed ?? false);
      setGeneratingWord(false);
    } else {
      generateNew();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = useCallback(async (word: string) => {
    if (!daily || generatingWord || revealed) return;
    const normTarget = normalize(daily.word);
    const normGuess = normalize(word);
    if (attempts.some(a => normalize(a.word) === normGuess)) return;

    setScoringLoading(true);
    const score = normGuess === normTarget ? 100 : await computeScoreAI(word, daily.word);
    setScoringLoading(false);

    const prevScore = attempts.length > 0 ? attempts[attempts.length - 1].score : null;
    const direction = getDirection(score, prevScore);
    const isWin = score === 100;
    const newAttempts = [...attempts, { word, score, direction }];

    setAttempts(newAttempts);

    if (isWin) {
      setWon(true);
      const updated = addWonWord({ word: daily.word, theme: daily.theme, attempts: newAttempts.length, date: dateStr });
      setWonWords(updated);
    }

    saveGameState({ date: dateStr, daily, attempts: newAttempts, won: isWin || won, revealed } as any);
  }, [attempts, daily, dateStr, generatingWord, won, revealed]);

  const handleReveal = useCallback(() => {
    if (!confirmReveal) { setConfirmReveal(true); return; }
    setRevealed(true);
    setConfirmReveal(false);
    saveGameState({ date: dateStr, daily, attempts, won, revealed: true } as any);
    setTimeout(() => generateNew(), 2500);
  }, [confirmReveal, daily, attempts, dateStr, won, generateNew]);

  const themeEmoji = daily ? (themeEmojis[daily.theme] ?? "🔤") : "🔤";
  const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;

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
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Won words sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
          <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-[#13092a] border-l border-white/10 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="font-bold text-white text-sm uppercase tracking-wider">🏆 Palabras acertadas</h2>
              <button onClick={() => setShowSidebar(false)} className="text-white/40 hover:text-white transition-colors text-xl leading-none w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {wonWords.length === 0 ? (
                <p className="text-white/30 text-xs text-center py-8 italic">Aún no has acertado ninguna. ¡Ánimo!</p>
              ) : wonWords.map((w, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white capitalize text-sm">{w.word}</span>
                    <span className="text-xs text-violet-300 font-mono">{w.attempts} int.</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-white/40">{themeEmojis[w.theme] ?? "🔤"} {w.theme}</span>
                    <span className="text-xs text-white/25 font-mono">{w.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 pb-12">

        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/40 font-mono">
              📅 {dateStr} <span className="text-violet-400">✦ IA</span>
            </div>
            <button
              onClick={() => setShowSidebar(true)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400/40 text-white/40 hover:text-amber-300 transition-all text-base"
              aria-label="Palabras acertadas"
            >
              🏆
              {wonWords.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-[#0d0820] text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {wonWords.length > 9 ? "9+" : wonWords.length}
                </span>
              )}
            </button>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white text-center">
            Adivina la{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Palabra</span>
          </h1>
        </header>

        {/* Theme + attempts */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Tema</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">{themeEmoji} {daily?.theme}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Intentos</div>
              <div className="text-2xl font-bold text-white">{attempts.length}</div>
            </div>
            <button
              onClick={generateNew}
              disabled={scoringLoading}
              aria-label="Nueva partida"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-violet-500/30 border border-white/10 hover:border-violet-400/40 text-white/50 hover:text-violet-300 transition-all disabled:opacity-30 text-base"
            >↺</button>
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
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-700" style={{ width: `${bestScore}%` }} />
            </div>
            {bestScore >= 70 && !won && !revealed && (
              <p className="text-xs text-violet-300 mt-1.5 text-center animate-pulse">¡Estás muy cerca! 🔥</p>
            )}
          </div>
        )}

        {/* Revealed banner */}
        {revealed && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 mb-4 text-center">
            <p className="text-amber-300 font-semibold text-sm mb-0.5">
              La palabra era: <span className="capitalize font-black text-amber-200">{daily?.word}</span>
            </p>
            <p className="text-white/40 text-xs animate-pulse">Generando nueva palabra…</p>
          </div>
        )}

        {/* Input + reveal */}
        {!won && !revealed && (
          <div className="mb-4">
            <label htmlFor="word-input" className="block text-xs text-white/40 uppercase tracking-wider mb-2">Tu intento</label>
            <WordInput onSubmit={handleGuess} disabled={scoringLoading} />
            {scoringLoading && (
              <div className="flex items-center gap-2 mt-2 text-xs text-violet-300 animate-pulse">
                <div className="w-3 h-3 rounded-full border border-violet-400 border-t-transparent animate-spin" />
                Consultando IA semántica…
              </div>
            )}
            <div className="flex justify-end mt-2">
              {!confirmReveal ? (
                <button
                  onClick={handleReveal}
                  disabled={scoringLoading}
                  className="text-xs text-white/25 hover:text-amber-300/80 transition-colors underline underline-offset-2 decoration-dotted disabled:opacity-20"
                >
                  👁 Revelar palabra
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-400/30 rounded-xl px-3 py-2">
                  <span className="text-xs text-amber-300">¿Seguro? Pasarás a la siguiente.</span>
                  <button onClick={handleReveal} className="text-xs bg-amber-500 hover:bg-amber-400 text-[#0d0820] font-bold px-2 py-0.5 rounded-lg transition-colors">Sí</button>
                  <button onClick={() => setConfirmReveal(false)} className="text-xs text-white/40 hover:text-white transition-colors">No</button>
                </div>
              )}
            </div>
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
