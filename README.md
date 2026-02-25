# 🔤 Adivina la Palabra

Juego diario en español estilo Wordle/Semantle. Cada día hay una palabra y un tema; escribe intentos y recibe una puntuación de cercanía (0–100%).

## 🚀 Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Build de producción

```bash
npm run build
npm start
```

## ☁️ Deploy en Vercel

### Opción A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones. No hace falta configurar variables de entorno.

### Opción B — GitHub + Vercel Dashboard

1. Sube el proyecto a un repositorio de GitHub.
2. Ve a [vercel.com/new](https://vercel.com/new).
3. Importa el repositorio → Vercel detecta Next.js automáticamente.
4. Haz clic en **Deploy**. ✅

## 🗂️ Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx          ← Página principal del juego
│   ├── layout.tsx        ← Layout raíz + metadatos SEO
│   └── globals.css       ← Estilos globales + Tailwind
├── components/
│   ├── WordInput.tsx     ← Input con autocompletar
│   ├── AttemptList.tsx   ← Historial de intentos
│   ├── ScoreBar.tsx      ← Barra de progreso visual
│   └── VictoryModal.tsx  ← Modal de victoria + compartir
├── lib/
│   ├── dailyWord.ts      ← Selección determinista diaria
│   ├── scoring.ts        ← Algoritmo de puntuación (0–100)
│   └── storage.ts        ← Persistencia en localStorage
└── data/
    └── words.ts          ← Banco de 200+ palabras con temas
```

## ⚙️ Cómo funciona

### Palabra del día
Se usa la fecha `YYYY-MM-DD` (zona Europe/Madrid) como semilla de un hash djb2, que elige un índice determinista del banco de palabras. Todos los usuarios reciben la misma palabra ese día.

### Puntuación (0–100)
Combinación ponderada de:
- **Levenshtein** (30%) — distancia de edición normalizada
- **Bigramas** (25%) — similitud Jaccard de bigramas
- **Trigramas** (15%) — similitud Jaccard de trigramas
- **Posición de letras** (15%) — letras en posición correcta + comunes
- **Prefijos/sufijos** (10%) — longitud del prefijo/sufijo común
- **Longitud similar** (5%) — penaliza diferencia de longitud

Score 100 → victoria (solo para coincidencia exacta normalizada).

### Persistencia
El estado se guarda en `localStorage` con la clave `adivinalapalabra_state`. Si la fecha almacenada no coincide con hoy, se descarta automáticamente.

## ➕ Añadir más palabras

Edita `src/data/words.ts` y añade entradas al array `WORDS`:

```ts
{ word: "tu_palabra", theme: "Tu Tema" },
```

La palabra debe estar en minúsculas, sin tildes obligatorias (el sistema normaliza automáticamente).
