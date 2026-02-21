"use client";

import { getScoreColor } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "lg";
}

export default function ScoreCircle({ score, size = "sm" }: ScoreCircleProps) {
  const color = getScoreColor(score);
  const isLarge = size === "lg";
  const dimension = isLarge ? 140 : 56;
  const strokeWidth = isLarge ? 8 : 4;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: dimension, height: dimension }}
    >
      <svg width={dimension} height={dimension} className="-rotate-90">
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span
        className="absolute font-bold"
        style={{
          color,
          fontSize: isLarge ? "2.25rem" : "0.875rem",
        }}
      >
        {score}
      </span>
    </div>
  );
}
