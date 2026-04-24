import React from "react";
import Link from "next/link";
import { ArrowLeft, GitBranch, Trophy, Terminal, ChevronRight, Activity } from "lucide-react";
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
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        
        {/* Navigation : Version discrète et pro */}
        <Link 
          href="/challenges"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#0052FF] transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux Missions</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="flex-1">
            
            {/* Badges : On utilise un style "Tag" minimaliste */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Type Badge - Style Outlined */}
              <div className="px-3 py-1 border-2 border-slate-900 rounded-lg shadow-[3px_3px_0px_0px_#0D0D0D]">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                  {challenge.type}
                </span>
              </div>
              
              {/* Difficulty - Style Minimal avec icône */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                {Icon && <Icon size={12} className="text-slate-500" />}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {challenge.level}
                </span>
              </div>
              
              {/* Category - Style Text-only */}
              <div className="flex items-center gap-2 px-3 py-1.5">
                <Activity size={12} className="text-[#0052FF]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {moduleConfig.category}
                </span>
              </div>
            </div>

            {/* Title : Typographie impactante */}
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
              {challenge.title}
            </h1>
          </div>

          {/* Points / Récompenses (Optionnel mais recommandé pour le style) */}
          <div className="flex items-center gap-4 lg:pb-2">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">XP Potential</p>
                <p className="text-2xl font-black text-[#F97316] italic">+{challenge.points}</p>
             </div>
             <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                <Trophy size={20} className="text-slate-300" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}