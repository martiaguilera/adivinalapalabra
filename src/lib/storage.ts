import { getTodayString } from "./dailyWord";
import { DailyWord } from "./wordGenerator";

export interface Attempt {
  word: string;
  score: number;
  direction: "closer" | "farther" | "same";
}

export interface GameState {
  date: string;
  daily: DailyWord;
  attempts: Attempt[];
  won: boolean;
}

const STORAGE_KEY = "adivinalapalabra_state";

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state: GameState = JSON.parse(raw);
    // Only restore if same day AND has a valid word
    if (state.date !== getTodayString() || !state.daily?.word) return null;
    return state;
  } catch {
    return null;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function clearGameState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}
