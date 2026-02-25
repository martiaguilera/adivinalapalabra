import { getTodayString } from "./dailyWord";

export interface Attempt {
  word: string;
  score: number;
  direction: "closer" | "farther" | "same";
}

export interface GameState {
  date: string;
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
    // Only return state if it's from today
    if (state.date !== getTodayString()) return null;
    return state;
  } catch {
    return null;
  }
}

export function saveGameState(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function clearGameState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
