import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { CHALLENGE_FILTERS, FilterItem } from "@/lib/challenge-constants";
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
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-gray-50/50 rounded-xl">
            {CHALLENGE_FILTERS.map((f) => {
              const Icon = f.icon;
              const count = f.id === "ALL" ? challenges.length : challenges.filter(c => c.type === f.id).length;
              const isActive = filter === f.id;
              
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                    }
                  `}
                >
                  <Icon size={12} style={{ color: isActive ? f.color : undefined }} />
                  <span>{f.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 rounded-xl font-mono text-xs"
            style={{ color: activeFilterConfig.color }}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={14} />
              <span className="font-medium">{activeFilterConfig.label}</span>
            </span>
            <span className="text-gray-400">
              {filteredCount} results
            </span>
          </button>

          {/* Search */}
          <div className="relative flex-1 md:flex-initial md:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 pl-9 pr-8 py-2.5 font-mono text-sm bg-gray-50/50 border border-gray-200 
                       rounded-xl focus:outline-none focus:border-gray-400 focus:bg-white
                       placeholder:text-gray-400 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        {showMobileFilters && (
          <div className="md:hidden mt-3 p-2 bg-gray-50 rounded-xl animate-slideUp">
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
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:bg-white/50'
                    }
                  `}
                >
                  <Icon size={14} style={{ color: f.color }} />
                  <span className="flex-1 text-left">{f.label}</span>
                  <span className="text-gray-400">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
