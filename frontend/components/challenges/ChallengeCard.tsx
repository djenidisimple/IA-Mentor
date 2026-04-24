import React from "react";
import Link from "next/link";
import { MoveRight, Zap, Trophy, Timer } from "lucide-react";
import { Challenge } from "@/types/challenge.types";
import { DIFFICULTY_SPECS, DEFAULT_DIFFICULTY_SPEC, MODULE_CONFIG, DEFAULT_MODULE_CONFIG } from "@/lib/challenge-constants";

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
}

export default function ChallengeCard({ challenge, index }: ChallengeCardProps) {
  const difficulty = DIFFICULTY_SPECS[challenge.level] ?? DEFAULT_DIFFICULTY_SPEC;
  const moduleConfig = MODULE_CONFIG[challenge.type] ?? DEFAULT_MODULE_CONFIG;
  const ModuleIcon = moduleConfig.icon;

  // Logique de couleur basée sur ta palette
  // Bleu: Primaire / Rouge: Hard / Orange: Medium-Easy
  const isHard = ['HARD', 'AVANCE'].includes(challenge.level);
  const statusColor = isHard ? "#EF4444" : "#F97316"; // Rouge ou Orange

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className="group block h-full font-['Outfit']"
    >
      <div className="relative h-full bg-white border-2 border-slate-900 flex flex-col transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0px_0px_#0052FF]">
        
        {/* Header Color Band - Utilise Orange ou Rouge selon la difficulté */}
        <div 
          className="h-2 w-full border-b-2 border-slate-900" 
          style={{ backgroundColor: statusColor }}
        />

        <div className="p-6 flex flex-col flex-1">
          {/* Top Info */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-900 text-white rounded-lg">
                <ModuleIcon size={18} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                {moduleConfig.label}
              </span>
            </div>
            <div 
              className="px-2 py-1 border-2 border-slate-900 text-[10px] font-black uppercase"
              style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
            >
              {challenge.level}
            </div>
          </div>

          {/* Titre & Description */}
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-[#0052FF] transition-colors">
              {challenge.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
              {challenge.description}
            </p>
          </div>

          {/* Tech Stack - Pillules Palette */}
          <div className="flex flex-wrap gap-2 mb-8">
            {challenge.technologies?.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-full border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Footer: XP & CTA */}
          <div className="mt-auto pt-6 border-t-2 border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Trophy size={16} className="text-[#F97316]" /> {/* Orange pour les trophées */}
                <span className="text-base font-black text-slate-900">{challenge.points}</span>
                <span className="text-[10px] font-bold text-slate-400">XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Timer size={14} />
                <span className="text-[11px] font-bold">
                   {isHard ? '90 MIN' : '45 MIN'}
                </span>
              </div>
            </div>

            {/* Bouton Bleu (Ta couleur primaire) */}
            <div className="flex items-center justify-center w-10 h-10 bg-[#0052FF] border-2 border-slate-900 text-white transition-transform group-hover:rotate-[-12deg]">
              <MoveRight size={20} />
            </div>
          </div>
        </div>

        {/* Badge de difficulté dynamique (Rouge pour Hard) */}
        {isHard && (
          <div className="absolute -top-3 -right-3 bg-[#EF4444] text-white p-1 border-2 border-slate-900 shadow-sm animate-pulse">
            <Zap size={14} fill="currentColor" />
          </div>
        )}
      </div>
    </Link>
  );
}