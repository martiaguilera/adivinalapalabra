import { NextRequest, NextResponse } from "next/server";
import { setDailyInKV } from "@/lib/kv";
import { getTodayString } from "@/lib/dailyWord";

const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.2-3b-instruct:free";

const THEMES = [
  "Animales", "Deportes", "Cine", "Cocina", "Música",
  "Ciencia", "Tecnología", "Naturaleza", "Historia", "Arte",
  "Geografía", "Literatura", "Viajes", "Moda", "Arquitectura",
];

async function generateDailyWord(date: string): Promise<{ word: string; theme: string } | null> {
  // Use date as seed to pick a theme deterministically
  let hash = 5381;
  for (let i = 0; i < date.length; i++) {
    hash = ((hash << 5) + hash) ^ date.charCodeAt(i);
    hash = hash >>> 0;
  }
  const theme = THEMES[hash % THEMES.length];

  const prompt = `Eres un generador de palabras para un juego en español.
Fecha: ${date}
Tema asignado: ${theme}

Genera UNA sola palabra en español que pertenezca al tema "${theme}".
Requisitos:
- Debe ser una palabra común conocida por la mayoría de hispanohablantes
- Entre 4 y 10 letras
- Sin tildes ni caracteres especiales (escríbela sin acentos)
- Una sola palabra, sin espacios
- No uses palabras muy obvias ni muy raras

Responde ÚNICAMENTE con la palabra en minúsculas, sin explicación, sin puntuación.`;

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
        max_tokens: 20,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`OpenRouter ${response.status}`);

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    // Clean: lowercase, no spaces, no punctuation, no accents
    const word = raw
      .toLowerCase()
      .split(/\s+/)[0]
      .replace(/[^a-záéíóúüñ]/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");

    if (word.length >= 4 && word.length <= 12) {
      return { word, theme };
    }
    return null;
  } catch (err) {
    console.error("AI word generation failed:", err);
    return null;
  }
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getTodayString();
  const result = await generateDailyWord(today);

  if (!result) {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }

  await setDailyInKV(today, result);

  return NextResponse.json({ success: true, date: today, ...result });
}
