const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL = "meta-llama/llama-3.2-3b-instruct:free";

const THEMES = [
  "Animales", "Deportes", "Cine", "Cocina", "Música",
  "Ciencia", "Tecnología", "Naturaleza", "Historia", "Arte",
  "Geografía", "Literatura", "Viajes", "Arquitectura", "Mitología",
];

export interface DailyWord {
  word: string;
  theme: string;
}

/**
 * Ask the AI to generate a random Spanish word with its theme.
 * Falls back to static selection if AI fails.
 */
export async function generateWordAI(): Promise<DailyWord> {
  // Pick a random theme
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];

  const prompt = `Eres un generador de palabras para un juego de adivinanzas en español.
Tema asignado: ${theme}

Genera UNA sola palabra en español del tema "${theme}".
Requisitos:
- Palabra común conocida por hispanohablantes
- Entre 4 y 10 letras
- Sin tildes ni acentos (escríbela sin acentos)
- Una sola palabra, sin espacios ni guiones
- Ni muy obvia ni muy rara: dificultad media

Responde ÚNICAMENTE con JSON en este formato exacto:
{"word":"lapalabra","theme":"${theme}"}`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://adivinalapalabra.vercel.app",
        "X-Title": "Adivina la Palabra",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        max_tokens: 40,
        temperature: 0.9,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter ${res.status}`);

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";

    // Parse JSON response
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean) as { word: string; theme: string };

    const word = parsed.word
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z]/g, "");

    if (word.length >= 4 && word.length <= 12) {
      return { word, theme: parsed.theme ?? theme };
    }
    throw new Error(`Invalid word: "${word}"`);
  } catch (err) {
    console.error("AI word generation failed, using fallback:", err);
    return getFallbackWord();
  }
}

/**
 * Static fallback in case AI is unavailable
 */
function getFallbackWord(): DailyWord {
  const fallbacks: DailyWord[] = [
    { word: "tigre", theme: "Animales" },
    { word: "guitarra", theme: "Música" },
    { word: "volcan", theme: "Naturaleza" },
    { word: "castillo", theme: "Historia" },
    { word: "paella", theme: "Cocina" },
    { word: "algoritmo", theme: "Tecnología" },
    { word: "delfin", theme: "Animales" },
    { word: "laberinto", theme: "Arquitectura" },
    { word: "cometa", theme: "Ciencia" },
    { word: "pelicula", theme: "Cine" },
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
