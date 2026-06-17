import React from "react";
import Link from "next/link";
import { MoveRight, Trophy, Users } from "lucide-react";
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

  const isHard = ['HARD', 'AVANCE'].includes(challenge.level);
  const difficultyColor = isHard ? "#EF4444" : "#F97316";

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className="group block h-full"
    >
      <div className="relative h-full bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--navy)] text-white rounded-lg">
              <ModuleIcon size={16} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--navy)]">
              {moduleConfig.label}
            </span>
          </div>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${difficultyColor}15`, color: difficultyColor }}
          >
            {challenge.level}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[var(--navy)] mb-2 leading-snug group-hover:text-[var(--blue)] transition-colors">
          {challenge.title}
        </h3>
        <p className="text-sm text-[var(--gray)] leading-relaxed line-clamp-2 mb-4">
          {challenge.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {challenge.technologies?.slice(0, 3).map((tech, i) => (
            <span
              key={i}
              className="text-[10px] font-bold text-[var(--navy)] bg-[var(--cream)] px-2.5 py-1 rounded-full border border-[var(--border-pink)]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--border-pink)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Trophy size={14} className="text-[var(--orange)]" />
              <span className="text-sm font-bold text-[var(--navy)]">{challenge.points}</span>
              <span className="text-[10px] font-bold text-[var(--gray)]">XP</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--gray)]">
              <Users size={14} />
              <span className="text-[11px] font-bold">{isHard ? '90' : '45'} min</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold text-[var(--blue)] group-hover:text-[var(--navy)] transition-colors">
            Voir le défi
            <MoveRight size={16} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
