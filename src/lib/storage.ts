import { DailyWord } from "./wordGenerator";

export interface Attempt {
  word: string;
  score: number;
  direction: "closer" | "farther" | "same";
}

export interface SolvedWord {
  word: string;
  theme: string;
  attempts: number;
  revealed: boolean;
  date: number;
}

export interface GameState {
  date: string;
  daily: DailyWord;
  attempts: Attempt[];
  won: boolean;
  revealed: boolean;
  solvedWords: SolvedWord[];
}

const STORAGE_KEY = "adivinalapalabra_state_v2";

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state: GameState = JSON.parse(raw);
    if (!state.daily?.word) return null;
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

export function loadSolvedWords(): SolvedWord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const state: Partial<GameState> = JSON.parse(raw);
    return state.solvedWords ?? [];
  } catch {
    return [];
  }
}

export function clearCurrentGame(solvedWords: SolvedWord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ solvedWords }));
  } catch { /* ignore */ }
}
