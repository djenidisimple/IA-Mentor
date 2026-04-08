"use client";

import React, { useEffect, useState, useMemo } from "react";
import { challengesApi } from "@/lib/challenges";
import { Challenge, ChallengeType } from "@/types/challenge.types";
import { Search } from "lucide-react";

import ChallengeStyles from "@/components/challenges/ChallengeStyles";
import ChallengeListHeader from "@/components/challenges/ChallengeListHeader";
import ChallengeFilters from "@/components/challenges/ChallengeFilters";
import ChallengeCard from "@/components/challenges/ChallengeCard";

export default function ChallengesPage(): React.ReactElement {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<ChallengeType | "ALL">("ALL");
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  useEffect(() => {
    const fetchChallenges = async (): Promise<void> => {
      try {
        setLoading(true);
        const data: Challenge[] = await challengesApi.getAll();
        setChallenges(data || []);
      } catch (e: unknown) {
        console.error("Failed to fetch challenges:", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenges();
  }, []);

  const filteredChallenges = useMemo(() => {
    let filtered = challenges;
    
    if (filter !== "ALL") {
      filtered = filtered.filter((c) => c.type === filter);
    }
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.technologies && c.technologies.some((t) => t.toLowerCase().includes(q)))
      );
    }
    
    return filtered;
  }, [challenges, filter, search]);

  const stats = {
    total: challenges.length,
    easy: challenges.filter(c => c.level === 'EASY' || c.level === 'DEBUTANT').length,
    medium: challenges.filter(c => c.level === 'MEDIUM' || c.level === 'INTERMEDIAIRE').length,
    hard: challenges.filter(c => c.level === 'HARD' || c.level === 'AVANCE').length,
    totalXP: filteredChallenges.reduce((acc, c) => acc + c.points, 0),
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] font-['Space_Grotesk'] relative">
      <ChallengeStyles />
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 geometric-bg opacity-40" />
        <div className="absolute inset-0 grid-overlay" />
      </div>

      <div className="relative z-10">
        <ChallengeListHeader 
          totalCount={stats.total}
          easyCount={stats.easy}
          mediumCount={stats.medium}
          hardCount={stats.hard}
          totalXP={stats.totalXP}
        />

        <ChallengeFilters 
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          challenges={challenges}
          filteredCount={filteredChallenges.length}
        />

        {/* Challenge Grid */}
        <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-8 md:py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-56 md:h-64 bg-gray-100 rounded-2xl animate-pulse overflow-hidden relative">
                  <div className="absolute inset-0 animate-shimmer" />
                </div>
              ))}
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="text-center py-20 md:py-28">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl mb-4">
                <Search size={28} className="text-gray-300 md:w-8 md:h-8" />
              </div>
              <p className="font-mono text-base md:text-lg text-gray-400 mb-4">
                No challenges found
              </p>
              <button
                onClick={() => { setSearch(""); setFilter("ALL"); }}
                className="font-mono text-sm text-gray-900 underline underline-offset-4 hover:text-gray-600"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filteredChallenges.map((challenge, index) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  index={index} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Minimal Footer */}
        <div className="border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-5 md:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 font-mono text-[9px] md:text-[10px] text-gray-400">
              <span>{filteredChallenges.length} challenges displayed</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Updated daily
                </span>
                <span className="text-gray-300">•</span>
                <span>v3.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
