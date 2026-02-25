"use client";

interface ScoreBarProps {
  score: number;
}

export function ScoreBar({ score }: ScoreBarProps) {
  const getColor = () => {
    if (score >= 80) return "bg-emerald-400";
    if (score >= 55) return "bg-yellow-400";
    if (score >= 30) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${getColor()}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
