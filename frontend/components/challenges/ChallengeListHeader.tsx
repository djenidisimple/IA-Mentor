import React from "react";

interface ChallengeListHeaderProps {
  totalCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  totalXP: number;
}

export default function ChallengeListHeader({
  totalCount,
  easyCount,
  mediumCount,
  hardCount,
  totalXP
}: ChallengeListHeaderProps) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-[var(--border-pink)]">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[var(--yellow)] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-[var(--gray)] tracking-wider uppercase">
                  {totalCount} DÉFIS
                </span>
              </div>
              <div className="w-px h-4 bg-[var(--border-pink)]" />
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-green-600">{easyCount} Facile</span>
                <span className="text-[10px] font-bold text-[var(--orange)]">{mediumCount} Moyen</span>
                <span className="text-[10px] font-bold text-red-600">{hardCount} Difficile</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--navy)] tracking-tight">
              Explorer les défis
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <div className="text-2xl font-bold text-[var(--navy)]">{totalXP}</div>
              <div className="text-[10px] font-bold text-[var(--gray)] tracking-wider">Total XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
