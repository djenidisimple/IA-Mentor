import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { CHALLENGE_FILTERS } from "@/lib/challenge-constants";
import { Challenge, ChallengeType } from "@/types/challenge.types";

interface ChallengeFiltersProps {
  filter: ChallengeType | "ALL";
  setFilter: (filter: ChallengeType | "ALL") => void;
  search: string;
  setSearch: (search: string) => void;
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  challenges: Challenge[];
  filteredCount: number;
}

export default function ChallengeFilters({
  filter,
  setFilter,
  search,
  setSearch,
  showMobileFilters,
  setShowMobileFilters,
  challenges,
  filteredCount
}: ChallengeFiltersProps) {
  const activeFilterConfig = CHALLENGE_FILTERS.find(f => f.id === filter) || CHALLENGE_FILTERS[0];

  return (
    <div className="sticky top-0 z-20 bg-[var(--cream)]/80 backdrop-blur-xl border-b border-[var(--border-pink)]">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="hidden md:flex items-center gap-1 p-1 bg-white rounded-xl border border-[var(--border-pink)]">
            {CHALLENGE_FILTERS.map((f) => {
              const Icon = f.icon;
              const count = f.id === "ALL" ? challenges.length : challenges.filter(c => c.type === f.id).length;
              const isActive = filter === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wide
                    transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--navy)] text-white shadow-sm'
                      : 'text-[var(--gray)] hover:text-[var(--navy)] hover:bg-white/50'
                    }
                  `}
                >
                  {Icon && <Icon size={14} style={{ color: isActive ? undefined : f.color }} />}
                  <span>{f.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-[var(--gray)]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center justify-between w-full px-4 py-2.5 bg-white rounded-xl border border-[var(--border-pink)] text-xs font-bold"
            style={{ color: activeFilterConfig.color }}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={14} />
              <span>{activeFilterConfig.label}</span>
            </span>
            <span className="text-[var(--gray)]">{filteredCount} résultats</span>
          </button>

          <div className="relative flex-1 md:flex-initial md:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray)]" />
            <input
              type="text"
              placeholder="Rechercher des défis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 pl-9 pr-8 py-2.5 text-sm bg-white border border-[var(--border-pink)]
                       rounded-xl focus:outline-none focus:border-[var(--blue)] focus:bg-white
                       placeholder:text-[var(--gray)] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray)] hover:text-[var(--navy)]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {showMobileFilters && (
          <div className="md:hidden mt-3 p-2 bg-white rounded-xl border border-[var(--border-pink)]">
            {CHALLENGE_FILTERS.map((f) => {
              const Icon = f.icon;
              const count = f.id === "ALL" ? challenges.length : challenges.filter(c => c.type === f.id).length;
              const isActive = filter === f.id;

              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    setShowMobileFilters(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold
                    transition-all duration-200
                    ${isActive
                      ? 'bg-[var(--navy)] text-white shadow-sm'
                      : 'text-[var(--gray)] hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={14} style={{ color: isActive ? undefined : f.color }} />
                  <span className="flex-1 text-left">{f.label}</span>
                  <span className="text-white/70">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
