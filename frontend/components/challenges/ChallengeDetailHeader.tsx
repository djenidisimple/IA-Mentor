import React from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
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

  return (
    <div className="bg-white border-b border-[var(--border-pink)]">
      <div className="max-w-[1200px] mx-auto px-6 py-8 sm:py-10">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--gray)] hover:text-[var(--blue)] transition-colors mb-6 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux défis</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <ChallengeBadge type="TYPE" value={challenge.type} />
              <ChallengeBadge type="DIFFICULTY" value={challenge.level} />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--navy)] tracking-tight leading-tight">
              {challenge.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 lg:pb-2">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--gray)] mb-1">XP Potentiel</p>
              <p className="text-2xl font-bold text-[var(--orange)]">+{challenge.points}</p>
            </div>
            <div className="w-12 h-12 bg-[var(--cream)] rounded-xl flex items-center justify-center border border-[var(--border-pink)]">
              <Trophy size={20} className="text-[var(--gray)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
