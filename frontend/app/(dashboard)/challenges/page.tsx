"use client";

import React, { useEffect, useState } from "react";
import { challengesApi } from "@/lib/challenges";
import { Challenge, ChallengeLevel, ChallengeType } from "@/types/challenge.types";
import { 
  ChevronRight, 
  Search, 
  Filter, 
  Clock, 
  Trophy, 
  Code, 
  Shield, 
  Cpu,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<ChallengeLevel | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<ChallengeType | 'ALL'>('ALL');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const data = await challengesApi.getAll();
        setChallenges(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter(c => {
    const matchLevel = filterLevel === 'ALL' || c.level === filterLevel;
    const matchType = filterType === 'ALL' || c.type === filterType;
    return matchLevel && matchType;
  });

  const getLevelColor = (level: ChallengeLevel) => {
    switch (level) {
      case 'DEBUTANT': return 'text-[#95E77E] border-[#95E77E]/30';
      case 'INTERMEDIAIRE': return 'text-[#E8C547] border-[#E8C547]/30';
      case 'AVANCE': return 'text-[#FF5F57] border-[#FF5F57]/30';
      default: return 'text-[#D64933] border-[#D64933]/30';
    }
  };

  const getChallengeIcon = (type: ChallengeType) => {
    switch (type) {
      case 'BACKEND': return <Shield className="w-5 h-5" />;
      case 'FRONTEND': return <Layers className="w-5 h-5" />;
      case 'FULLSTACK': return <Cpu className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-[#D64933]/20 pb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D64933]/10 border border-[#D64933]/30 rounded-none">
              <span className="text-[#D64933] font-mono text-[10px] font-bold tracking-widest uppercase">LABORATOIRE</span>
            </div>
            <h1 className="text-5xl font-black tracking-[-3px] text-[#F2E9E2] uppercase">
              CHALLENGES<span className="text-[#D64933]">.EXE</span>
            </h1>
            <p className="text-[#B8B0A0] font-mono text-sm max-w-xl">
              Selectionne un projet, casse-le, répare-le. Reçois un feedback immédiat par IA sur ta soumission.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-[#0F0E0E] border border-[#D64933]/20 px-4 py-2">
              <Filter className="w-4 h-4 text-[#D64933]" />
              <select 
                value={filterLevel} 
                onChange={(e) => setFilterLevel(e.target.value as any)}
                className="bg-transparent border-none focus:outline-none font-mono text-xs text-[#F2E9E2]"
              >
                <option value="ALL">TOUS LES NIVEAUX</option>
                <option value="DEBUTANT">DÉBUTANT</option>
                <option value="INTERMEDIAIRE">INTERMÉDIAIRE</option>
                <option value="AVANCE">AVANCÉ</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#0F0E0E] border border-[#D64933]/20 px-4 py-2">
              <Code className="w-4 h-4 text-[#D64933]" />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as any)}
                className="bg-transparent border-none focus:outline-none font-mono text-xs text-[#F2E9E2]"
              >
                <option value="ALL">TOUTES LES STACKS</option>
                <option value="BACKEND">BACKEND</option>
                <option value="FRONTEND">FRONTEND</option>
                <option value="FULLSTACK">FULLSTACK</option>
              </select>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-[#141414] border border-[#D64933]/10"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-[#D64933]/10 border border-[#D64933] p-8 text-center">
            <p className="text-[#D64933] font-mono font-bold">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-[#D64933] text-[#D64933] hover:bg-[#D64933] hover:text-[#1A1919]">RÉESSAYER</Button>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="text-center py-20 bg-[#0F0E0E] border border-[#D64933]/20">
            <Search className="w-12 h-12 text-[#666] mx-auto mb-4" />
            <p className="text-[#666] font-mono italic">Aucun challenge ne correspond à cette séquence de filtres.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChallenges.map((challenge) => (
              <Link 
                key={challenge.id} 
                href={`/challenges/${challenge.slug}`}
                className="group relative bg-[#0F0E0E] border border-[#D64933]/20 p-8 hover:border-[#D64933] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  {getChallengeIcon(challenge.type)}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className={`text-[9px] font-mono font-bold border px-2 py-0.5 tracking-tighter ${getLevelColor(challenge.level)}`}>
                    {challenge.level}
                  </div>
                  <div className="text-[9px] font-mono text-[#D64933] border border-[#D64933]/30 px-2 py-0.5 tracking-tighter">
                    {challenge.type}
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-4 group-hover:text-[#D64933] transition-colors">{challenge.title}</h3>
                <p className="text-[#B8B0A0] font-mono text-xs leading-relaxed mb-8 line-clamp-3">
                  {challenge.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-10">
                  {challenge.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className="text-[10px] text-[#666] font-mono">#{tech}</span>
                  ))}
                  {challenge.technologies.length > 3 && (
                    <span className="text-[10px] text-[#666] font-mono">+{challenge.technologies.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#D64933]/10">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#E8C547]" />
                    <span className="text-sm font-mono font-bold text-[#E8C547]">{challenge.points} PTS</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#D64933] font-mono text-xs font-bold group-hover:gap-3 transition-all">
                    COMMENCER <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}