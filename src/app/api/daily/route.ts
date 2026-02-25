import { NextResponse } from "next/server";
import { getDailyFromKV } from "@/lib/kv";
import { getDailyWord, getTodayString } from "@/lib/dailyWord";

export const revalidate = 0;

export async function GET() {
  const today = getTodayString();

  // Try KV first (AI-generated word)
  const kvWord = await getDailyFromKV(today);
  if (kvWord) {
    return NextResponse.json(kvWord);
  }

  // Fallback to deterministic static bank
  const fallback = getDailyWord(today);
  return NextResponse.json({ ...fallback, date: today, source: "static" });
}
