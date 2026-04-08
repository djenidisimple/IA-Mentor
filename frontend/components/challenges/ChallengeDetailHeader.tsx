import React from "react";
import Link from "next/link";
import { ArrowLeft, GitBranch, Quote, Trophy, Terminal, ChevronRight } from "lucide-react";
import { Challenge } from "@/types/challenge.types";
import { MODULE_CONFIG, DEFAULT_MODULE_CONFIG, DIFFICULTY_SPECS, DEFAULT_DIFFICULTY_SPEC } from "@/lib/challenge-constants";
import ChallengeBadge from "./ChallengeBadge";

interface ChallengeDetailHeaderProps {
  challenge: Challenge;
}

function StatsRow({ challenge }: { challenge: Challenge }) {
  const diffSpec = DIFFICULTY_SPECS[challenge.level] ?? DEFAULT_DIFFICULTY_SPEC;
  
  const stats = [
    { label: "Difficulty", value: challenge.level, color: diffSpec.color },
    { label: "Points", value: `${challenge.points} XP`, color: "#3B82F6" },
    { label: "Stack", value: challenge.technologies?.length || 0, suffix: "techs", color: "#8B5CF6" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6 py-3 border-y border-gray-100">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono uppercase">{stat.label}</span>
          <span className="font-mono text-sm font-semibold" style={{ color: stat.color }}>
            {stat.value}{stat.suffix ? ` ${stat.suffix}` : ''}
          </span>
          {i < stats.length - 1 && <span className="text-gray-200">|</span>}
        </div>
      ))}
    </div>
  );
}

export default function ChallengeDetailHeader({ challenge }: ChallengeDetailHeaderProps) {
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
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{challenge.slug}</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
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

              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse-subtle" />
                <span className="font-mono text-[10px] text-gray-500">Active</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-['Inter'] text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              {challenge.title}
            </h1>

            {/* Description */}
            <div className="mb-6">
              <div className="flex items-start gap-4 p-5 bg-gray-50/80 rounded-xl border border-gray-100">
                <div className="shrink-0">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                    <Quote size={18} className="text-gray-400" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 leading-relaxed text-base italic">
                    "{challenge.description}"
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-5 h-px bg-gray-300" />
                    <span className="text-xs text-gray-400 font-mono">Problem Statement</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <StatsRow challenge={challenge} />
          </div>

          {/* CTA Card */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-900 rounded-xl mb-3">
                  <Trophy size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Ready to start?</h3>
                <p className="text-sm text-gray-500">Complete this challenge</p>
              </div>

              <button className="w-full group relative mb-4">
                <div className="relative w-full bg-gray-900 text-white font-mono text-sm font-medium py-3.5 px-6 rounded-xl
                              flex items-center justify-center gap-2
                              hover:bg-gray-800 transition-all duration-200">
                  <Terminal size={16} />
                  <span>Start Challenge</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Reward</span>
                  <span className="font-mono font-bold text-gray-800">{challenge.points} XP</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Difficulty</span>
                  <span className="font-mono" style={{ color: diffSpec.color }}>{challenge.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
