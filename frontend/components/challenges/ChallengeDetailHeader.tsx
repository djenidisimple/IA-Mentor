import React from "react";
import Link from "next/link";
import { ArrowLeft, GitBranch, Trophy, Terminal, ChevronRight } from "lucide-react";
import { Challenge } from "@/types/challenge.types";
import { MODULE_CONFIG, DEFAULT_MODULE_CONFIG, DIFFICULTY_SPECS, DEFAULT_DIFFICULTY_SPEC } from "@/lib/challenge-constants";
import ChallengeBadge from "./ChallengeBadge";

interface ChallengeDetailHeaderProps {
  challenge: Challenge;
  onStart?: () => void;
}

export default function ChallengeDetailHeader({ challenge, onStart }: ChallengeDetailHeaderProps) {
  const moduleConfig = MODULE_CONFIG[challenge.type] ?? DEFAULT_MODULE_CONFIG;
  const diffSpec = DIFFICULTY_SPECS[challenge.level] ?? DEFAULT_DIFFICULTY_SPEC;
  const Icon = diffSpec.icon;

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link 
          href="/challenges"
          className="inline-flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-gray-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Challenges</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex-1">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <ChallengeBadge type="TYPE" value={challenge.type} />
              
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{ 
                  backgroundColor: diffSpec.bgColor, 
                  borderColor: diffSpec.borderColor, 
                }}
              >
                {Icon && <Icon size={14} style={{ color: diffSpec.color }} />}
                <span className="font-mono text-xs font-semibold" style={{ color: diffSpec.color }}>
                  {challenge.level}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                <GitBranch size={14} className="text-gray-500" />
                <span className="font-mono text-xs text-gray-600">
                  {moduleConfig.category}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-['Inter'] text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              {challenge.title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
