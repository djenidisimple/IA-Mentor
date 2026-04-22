import React from "react";
import { DIFFICULTY_SPECS, DEFAULT_DIFFICULTY_SPEC, MODULE_CONFIG, DEFAULT_MODULE_CONFIG } from "@/lib/challenge-constants";
import { ChallengeLevel, ChallengeType } from "@/types/challenge.types";
import { LucideIcon } from "lucide-react";

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
      <div 
        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] md:text-[9px] font-black tracking-wider uppercase border ${className}`}
        style={{ 
          backgroundColor: spec.bgColor, 
          color: spec.color,
          borderColor: spec.borderColor
        }}
      >
        {showIcon && Shape && (
          <Shape className="w-2 h-2 md:w-2.5 md:h-2.5" style={{ fill: spec.color }} />
        )}
        {spec.label}
      </div>
    );
  }

  // Challenge Type Badge
  const config = MODULE_CONFIG[value as ChallengeType] ?? DEFAULT_MODULE_CONFIG;
  const Icon = config.icon;

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${className}`}
      style={{ 
        backgroundColor: `${config.color}10`, // Subtle version of the color
        borderColor: `${config.color}20`,
        color: config.color 
      }}
    >
      {showIcon && <Icon size={14} />}
      <span className="font-mono text-xs font-semibold uppercase tracking-wider">
        {config.label}
      </span>
    </div>
  );
}
