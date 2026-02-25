"use client";

import { useState, useRef, useEffect } from "react";
import { normalize } from "@/lib/scoring";

interface WordInputProps {
  onSubmit: (word: string) => void;
  disabled?: boolean;
}

export function WordInput({ onSubmit, disabled }: WordInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (word?: string) => {
    const raw = (word ?? value).trim();
    if (!raw) {
      setError("Escribe una palabra.");
      return;
    }
    if (/\d/.test(raw)) {
      setError("Solo se aceptan palabras, sin números.");
      return;
    }
    setValue("");
    setError("");
    onSubmit(raw);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          id="word-input"
          aria-label="Escribe tu intento"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          disabled={disabled}
          placeholder="Escribe una palabra…"
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400/60 disabled:opacity-40 transition-all text-base"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={disabled}
          aria-label="Enviar intento"
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold px-5 py-3 rounded-xl transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          →
        </button>
      </div>
      {error && (
        <p role="alert" className="text-red-400 text-xs mt-1.5 ml-1">
          {error}
        </p>
      )}
    </div>
  );
}
