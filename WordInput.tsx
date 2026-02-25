"use client";

import { useState, useRef, useEffect } from "react";
import { WORDS } from "@/data/words";
import { normalize } from "@/lib/scoring";

interface WordInputProps {
  onSubmit: (word: string) => void;
  disabled?: boolean;
}

export function WordInput({ onSubmit, disabled }: WordInputProps) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleChange = (val: string) => {
    setValue(val);
    setError("");
    if (val.trim().length >= 2) {
      const norm = normalize(val.trim());
      const matches = WORDS.map((w) => w.word)
        .filter((w) => normalize(w).startsWith(norm) && normalize(w) !== norm)
        .slice(0, 6);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

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
    setShowSuggestions(false);
    setValue("");
    setSuggestions([]);
    onSubmit(raw);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            id="word-input"
            aria-label="Escribe tu intento"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") setShowSuggestions(false);
            }}
            disabled={disabled}
            placeholder="Escribe una palabra…"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400/60 disabled:opacity-40 transition-all text-base"
          />
          {showSuggestions && (
            <ul
              role="listbox"
              className="absolute top-full left-0 right-0 mt-1 bg-[#1a1030] border border-white/20 rounded-xl overflow-hidden z-20 shadow-xl"
            >
              {suggestions.map((s) => (
                <li
                  key={s}
                  role="option"
                  aria-selected={false}
                  className="px-4 py-2 text-white/80 hover:bg-white/10 cursor-pointer text-sm capitalize transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSubmit(s);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
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
