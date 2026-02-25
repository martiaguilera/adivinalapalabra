export interface DailyWord {
  word: string;
  theme: string;
  date: string;
  source: "ai" | "static";
}

/**
 * Get today's AI-generated word from Vercel KV.
 * Returns null if KV is not configured or key doesn't exist.
 */
export async function getDailyFromKV(date: string): Promise<DailyWord | null> {
  try {
    // Vercel KV is accessed via environment variables automatically
    // We use the REST API directly so no extra SDK is needed at build time
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) return null;

    const res = await fetch(`${kvUrl}/get/daily:${date}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
      next: { revalidate: 3600 }, // cache 1h on edge
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.result) return null;

    const parsed = JSON.parse(data.result) as DailyWord;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Save today's AI-generated word to Vercel KV.
 * Sets expiry of 48h so old keys are auto-cleaned.
 */
export async function setDailyInKV(
  date: string,
  entry: { word: string; theme: string }
): Promise<void> {
  try {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) return;

    const value: DailyWord = { ...entry, date, source: "ai" };

    await fetch(`${kvUrl}/set/daily:${date}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: JSON.stringify(value),
        ex: 172800, // 48 hours TTL
      }),
    });
  } catch (err) {
    console.error("KV set failed:", err);
  }
}
