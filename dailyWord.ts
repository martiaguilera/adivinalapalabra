import { WORDS, WordEntry } from "@/data/words";

/**
 * Get today's date string in YYYY-MM-DD format using Europe/Madrid timezone
 */
export function getTodayString(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Madrid",
  });
}

/**
 * Simple deterministic hash of a string → unsigned 32-bit integer
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0; // keep unsigned 32-bit
  }
  return hash;
}

/**
 * Get today's word entry deterministically based on date
 */
export function getDailyWord(dateStr?: string): WordEntry {
  const date = dateStr ?? getTodayString();
  const seed = hashString(date);
  const index = seed % WORDS.length;
  return WORDS[index];
}
