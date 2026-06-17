"use client";

import React, { useEffect, useState, useMemo } from "react";
import { challengesApi } from "@/lib/challenges";
import { Challenge, ChallengeType } from "@/types/challenge.types";
import { Search, Target } from "lucide-react";
import ChallengeCard from "@/components/challenges/ChallengeCard";
import { CardGridSkeleton } from "@/components/ui/Skeleton";

export default function ChallengesPage(): React.ReactElement {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<ChallengeType | "ALL">("ALL");

  useEffect(() => {
    const fetchChallenges = async (): Promise<void> => {
      try {
        setLoading(true);
        const data: Challenge[] = await challengesApi.getAll();
        setChallenges(data || []);
      } catch (e: unknown) {
        console.error("Erreur lors de la récupération des challenges:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const filteredChallenges = useMemo(() => {
    let filtered = challenges;
    if (filter !== "ALL") filtered = filtered.filter((c) => c.type === filter);
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
    easy: challenges.filter(c => ['EASY', 'DEBUTANT'].includes(c.level)).length,
    medium: challenges.filter(c => ['MEDIUM', 'INTERMEDIAIRE'].includes(c.level)).length,
    hard: challenges.filter(c => ['HARD', 'AVANCE'].includes(c.level)).length,
    totalXP: filteredChallenges.reduce((acc, c) => acc + c.points, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cream)]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <CardGridSkeleton count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <header className="bg-white border-b border-[var(--border-pink)]">
        <div className="max-w-[1200px] mx-auto px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight mb-3">
                Explorer les défis
              </h1>
              <p className="text-[var(--gray)] text-sm max-w-md leading-relaxed">
                Améliorez vos compétences techniques avec des défis concrets et gagnez des points d&apos;XP.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-wider">Total</p>
                <p className="text-xl font-bold text-[var(--navy)]">{stats.total}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-wider">Difficile</p>
                <p className="text-xl font-bold text-[var(--navy)]">{stats.hard}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-wider">XP Total</p>
                <p className="text-xl font-bold text-[var(--blue)]">{stats.totalXP}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[var(--border-pink)]">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un défi (ex: React, API...)"
                className="w-full bg-transparent pl-7 py-2 text-sm focus:outline-none border-b border-transparent focus:border-[var(--blue)] transition-colors"
              />
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {['ALL', 'FRONTEND', 'BACKEND', 'FULLSTACK'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                    filter === t ? 'text-[var(--blue)]' : 'text-[var(--gray)] hover:text-[var(--navy)]'
                  }`}
                >
                  {t === 'ALL' ? 'Tous' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-8 sm:py-12">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[var(--border-pink)] rounded-xl">
            <Target className="w-8 h-8 text-[var(--border-pink)] mx-auto mb-4" />
            <p className="text-[var(--gray)] text-sm font-bold">Aucun challenge ne correspond à votre recherche.</p>
            <button
              onClick={() => { setSearch(""); setFilter("ALL"); }}
              className="mt-4 text-[var(--blue)] text-[11px] font-bold uppercase tracking-widest border-b border-[var(--blue)]"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--border-pink)] bg-white py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <p className="text-[11px] font-bold text-[var(--gray)] uppercase tracking-widest">
            {filteredChallenges.length} défis disponibles
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-[var(--gray)] uppercase tracking-widest">Mis à jour en temps réel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
