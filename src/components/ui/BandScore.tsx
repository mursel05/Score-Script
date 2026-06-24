"use client";

import { getBandColor, getBandLabel } from "@/src/types";

interface BandScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function BandScore({ score, size = "md", showLabel = true }: BandScoreProps) {
  const color = getBandColor(score);
  const label = getBandLabel(score);

  const sizeConfig = {
    sm: { ring: 56, stroke: 4, radius: 22, fontSize: "text-base", labelSize: "text-xs" },
    md: { ring: 88, stroke: 5, radius: 36, fontSize: "text-2xl", labelSize: "text-xs" },
    lg: { ring: 120, stroke: 6, radius: 50, fontSize: "text-4xl", labelSize: "text-sm" },
  };

  const { ring, stroke, radius, fontSize, labelSize } = sizeConfig[size];
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 5) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: ring, height: ring }}>
        <svg
          width={ring}
          height={ring}
          viewBox={`0 0 ${ring} ${ring}`}
          className="-rotate-90"
        >
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="#e7e5e4"
            strokeWidth={stroke}
          />
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="score-ring"
            style={{ transitionProperty: "stroke-dasharray", transitionDuration: "1s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${fontSize} font-bold leading-none`} style={{ color }}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`${labelSize} font-medium text-stone-500`}>{label}</span>
      )}
    </div>
  );
}
