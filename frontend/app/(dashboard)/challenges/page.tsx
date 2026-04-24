"use client";

import React, { useEffect, useState, useMemo } from "react";
import { challengesApi } from "@/lib/challenges";
import { Challenge, ChallengeType } from "@/types/challenge.types";
import { Search, Trophy, Target, Zap, Filter } from "lucide-react";
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-['Outfit']">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0052FF] animate-spin mb-4" />
        <p className="text-[13px] font-medium uppercase tracking-widest text-slate-400">Préparation des défis</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Outfit']">
      {/* ── En-tête de page ── */}
      <header className="border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[#0052FF] rotate-45" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0052FF]">
                  Zone d'entraînement
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#0D0D0D] mb-4">
                Challenges <span className="text-slate-300">/</span> Bibliothèque
              </h1>
              <p className="text-slate-500 max-w-md text-[15px] leading-relaxed">
                Améliorez vos compétences techniques avec des défis concrets et gagnez des points d'XP.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 border-l border-slate-100 pl-0 md:pl-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                <p className="text-xl font-bold text-[#0D0D0D]">{stats.total}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Difficile</p>
                <p className="text-xl font-bold text-[#0D0D0D]">{stats.hard}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Points XP</p>
                <p className="text-xl font-bold text-[#0052FF]">{stats.totalXP}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Filtres & Recherche ── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un défi (ex: React, API...)"
                className="w-full bg-transparent pl-7 py-2 text-sm focus:outline-none border-b border-transparent focus:border-[#0052FF] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {['ALL', 'FRONTEND', 'BACKEND', 'FULLSTACK'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t as any)}
                  className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                    filter === t ? 'text-[#0052FF]' : 'text-slate-400 hover:text-[#0D0D0D]'
                  }`}
                >
                  {t === 'ALL' ? 'Tous' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Grille de Challenges ── */}
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-slate-200">
            <Target className="w-8 h-8 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-medium">Aucun challenge ne correspond à votre recherche.</p>
            <button
              onClick={() => { setSearch(""); setFilter("ALL"); }}
              className="mt-4 text-[#0052FF] text-[11px] font-bold uppercase tracking-widest border-b border-[#0052FF]"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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

      {/* ── Footer Stats ── */}
      <footer className="border-t border-slate-100 py-8 bg-slate-50/50">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {filteredChallenges.length} défis disponibles
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mis à jour en temps réel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}