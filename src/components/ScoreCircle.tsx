"use client";

import { getScoreColor } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: "sm" | "lg";
  animated?: boolean;
}

export default function ScoreCircle({
  score,
  size = "sm",
  animated = false,
}: ScoreCircleProps) {
  const color = getScoreColor(score);
  const isLarge = size === "lg";
  const dimension = isLarge ? 160 : 56;
  const strokeWidth = isLarge ? 10 : 4;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

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
          strokeDashoffset={animated ? undefined : offset}
          strokeLinecap="round"
          className={animated ? "score-circle-animated" : ""}
          style={
            animated
              ? ({
                  "--circumference": circumference,
                  "--target-offset": offset,
                } as React.CSSProperties)
              : undefined
          }
        />
      </svg>
      <span
        className={`absolute font-bold ${animated ? "score-number-animated" : ""}`}
        style={{
          color,
          fontSize: isLarge ? "2.75rem" : "0.875rem",
        }}
      >
        {score}
      </span>
    </div>
  );
}
