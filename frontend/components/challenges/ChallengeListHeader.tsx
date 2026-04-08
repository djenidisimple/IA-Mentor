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
    <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-mono text-[9px] md:text-[10px] text-gray-500 tracking-wider">
                  {totalCount} CHALLENGES
                </span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] md:text-[10px] text-emerald-600">{easyCount} Easy</span>
                <span className="font-mono text-[9px] md:text-[10px] text-amber-600">{mediumCount} Medium</span>
                <span className="font-mono text-[9px] md:text-[10px] text-red-600">{hardCount} Hard</span>
              </div>
            </div>
            
            <h1 className="font-['Syne'] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900">
              Explore <span className="text-red-500">C</span>
              <span className="text-blue-500">h</span>
              <span className="text-yellow-500">a</span>
              <span className="text-green-500">l</span>
              <span className="text-purple-500">l</span>
              <span className="text-red-500">e</span>
              <span className="text-blue-500">n</span>
              <span className="text-yellow-500">g</span>
              <span className="text-green-500">e</span>
              <span className="text-purple-500">s</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <div className="font-mono text-2xl font-bold text-gray-900">{totalXP}</div>
              <div className="font-mono text-[9px] text-gray-400 tracking-wider">Total XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
