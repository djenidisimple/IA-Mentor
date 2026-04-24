import React from "react";
import Link from "next/link";
import { ArrowLeft, FileCode, SearchX, Terminal } from "lucide-react";
import { challengesApi } from "@/lib/challenges";
import { Challenge } from "@/types/challenge.types";

import ChallengeStyles from "@/components/challenges/ChallengeStyles";
import ChallengeStepLayout from "@/components/challenges/ChallengeStepLayout";

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  
  const challenge: Challenge | null = await challengesApi.getBySlug(slug).catch(() => {
    return null;
  });

  // --- ÉTAT : CHALLENGE NON TROUVÉ (STYLE NEO-BENTO) ---
  if (!challenge) {
    return (
      <div className="min-h-screen bg-white font-sans flex items-center justify-center p-6">
        <ChallengeStyles />
        
        <div className="max-w-md w-full">
          <div className="border-2 border-slate-900 rounded-[2.5rem] p-10 bg-white shadow-[12px_12px_0px_0px_#0D0D0D] text-center relative overflow-hidden">
            {/* Décoration subtile en arrière-plan */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[2.5rem] flex items-center justify-center">
              <SearchX size={32} className="text-slate-200" />
            </div>

            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0052FF]/5 border-2 border-[#0052FF] rounded-3xl mb-8 rotate-3">
              <Terminal size={32} className="text-[#0052FF]" />
            </div>

            <h1 className="text-3xl font-black tracking-tighter text-slate-900 mb-2 uppercase">
              Challenge Introuvable
            </h1>
            
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8 px-4 leading-relaxed">
              Le slug <span className="text-[#F97316] font-black underline underline-offset-4">&quot;{slug}&quot;</span> est invalide ou a été déplacé.
            </p>

            <Link 
              href="/challenges"
              className="group w-full inline-flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#0052FF] transition-all shadow-xl hover:shadow-[0_10px_30px_-10px_rgba(0,82,255,0.5)]"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Retourner aux Missions
            </Link>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                Erreur de Routage • DevReview Engine
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ÉTAT : CHALLENGE TROUVÉ ---
  return (
    <div className="min-h-screen bg-white font-sans">
      <ChallengeStyles />
      <main className="max-w-[1400px] mx-auto">
        <ChallengeStepLayout challenge={challenge} />
      </main>
    </div>
  );
}