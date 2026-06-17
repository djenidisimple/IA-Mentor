import React from "react";
import { DIFFICULTY_SPECS, DEFAULT_DIFFICULTY_SPEC, MODULE_CONFIG, DEFAULT_MODULE_CONFIG } from "@/lib/challenge-constants";
import { ChallengeLevel, ChallengeType } from "@/types/challenge.types";

interface ChallengeBadgeProps {
  type: "DIFFICULTY" | "TYPE";
  value: ChallengeLevel | ChallengeType | string;
  showIcon?: boolean;
  className?: string;
}

export default function ChallengeBadge({ type, value, showIcon = true, className = "" }: ChallengeBadgeProps) {
  if (type === "DIFFICULTY") {
    const spec = DIFFICULTY_SPECS[value] ?? DEFAULT_DIFFICULTY_SPEC;
    const Shape = spec.shape;
    const Icon = spec.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${className}`}
        style={{
          backgroundColor: spec.bgColor,
          color: spec.color,
          borderColor: spec.borderColor
        }}
      >
        {showIcon && Shape && (
          <Shape className="w-2.5 h-2.5" style={{ fill: spec.color }} />
        )}
        {spec.label}
      </span>
    );
  }

  const config = MODULE_CONFIG[value as ChallengeType] ?? DEFAULT_MODULE_CONFIG;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${className}`}
      style={{
        backgroundColor: `${config.color}10`,
        borderColor: `${config.color}20`,
        color: config.color
      }}
    >
      {showIcon && <Icon size={14} />}
      {config.label}
    </span>
  );
}
