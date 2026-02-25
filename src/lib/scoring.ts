const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.2-3b-instruct:free";

/**
 * Normalize a Spanish word: lowercase, remove accents, trim
 */
export function normalize(word: string): string {
  return word
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/ü/g, "u");
}

/**
 * Call OpenRouter to get a semantic similarity score (0-99) between two Spanish words.
 * Returns null if the call fails, so the caller can fallback.
 */
export async function computeScoreAI(
  attempt: string,
  target: string
): Promise<number> {
  const a = normalize(attempt);
  const t = normalize(target);

  if (a === t) return 100;

  const prompt = `Eres un experto en semántica del español. Tu tarea es evaluar qué tan similar o cercana semánticamente es una palabra de intento respecto a una palabra objetivo.

Palabra objetivo: "${target}"
Palabra de intento: "${attempt}"

Devuelve ÚNICAMENTE un número entero entre 0 y 99 representando la similitud semántica, donde:
- 0 = completamente diferente, sin ninguna relación
- 30 = relación muy lejana o temática muy diferente
- 50 = alguna relación o tema similar
- 70 = bastante relacionada, mismo campo semántico
- 90 = muy similar, casi sinónimos o conceptos muy cercanos
- 99 = prácticamente idéntica en significado

Considera: significado, campo semántico, uso cotidiano, asociaciones temáticas.
NO expliques nada. Responde SOLO con el número.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://adivinalapalabra.vercel.app",
        "X-Title": "Adivina la Palabra",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: 10,
        temperature: 0,
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    const parsed = parseInt(raw.replace(/\D/g, ""), 10);

    if (!isNaN(parsed) && parsed >= 0 && parsed <= 99) {
      return parsed;
    }

    throw new Error(`Invalid score response: "${raw}"`);
  } catch (err) {
    console.error("OpenRouter scoring failed, using fallback:", err);
    return computeScoreFallback(attempt, target);
  }
}

/**
 * Fallback: fast local scoring (Levenshtein + n-grams) used when AI is unavailable.
 */
function computeScoreFallback(attempt: string, target: string): number {
  const a = normalize(attempt);
  const t = normalize(target);
  if (a === t) return 100;

  // Levenshtein
  const m = a.length, n = t.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === t[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  const levScore = 1 - dp[m][n] / Math.max(m, n);

  // Bigrams
  const bg = (s: string) => { const r = new Set<string>(); for (let i=0;i<s.length-1;i++) r.add(s.slice(i,i+2)); return r; };
  const ba = bg(a), bt = bg(t);
  const inter = [...ba].filter(x => bt.has(x)).length;
  const bigramSim = (ba.size + bt.size) > 0 ? inter / (ba.size + bt.size - inter) : 0;

  const combined = levScore * 0.5 + bigramSim * 0.5;
  return Math.min(99, Math.max(0, Math.round(combined * 99)));
}

export type Direction = "closer" | "farther" | "same";

export function getDirection(
  currentScore: number,
  previousScore: number | null
): Direction {
  if (previousScore === null) return "same";
  if (currentScore > previousScore) return "closer";
  if (currentScore < previousScore) return "farther";
  return "same";
}
