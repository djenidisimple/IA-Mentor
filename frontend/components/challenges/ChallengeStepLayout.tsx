"use client";

import React, { useState } from "react";
import { Challenge } from "@/types/challenge.types";
import ChallengeStepper, { ChallengeStep } from "./ChallengeStepper";
import ChallengeBrief from "./ChallengeBrief";
import ChallengeTechnicalSpecs from "./ChallengeTechnicalSpecs";
import ChallengeSubmissionForm from "./ChallengeSubmissionForm";
import ChallengeAIFeedback from "./ChallengeAIFeedback";
import ChallengeDetailHeader from "./ChallengeDetailHeader";
import ChallengeDetailSidebar from "./ChallengeDetailSidebar";
import { Calendar, Terminal, ChevronRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { submissionsApi } from "@/lib/submissions";

interface ChallengeStepLayoutProps {
  challenge: Challenge;
}

export default function ChallengeStepLayout({ challenge }: ChallengeStepLayoutProps) {
  const [currentStep, setCurrentStep] = useState<ChallengeStep>(1);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartChallenge = async () => {
    setLoading(true);
    setError(null);
    try {
      await submissionsApi.start(challenge.id);
      setCurrentStep(2);
    } catch (err: any) {
      console.error("Failed to start challenge:", err);
      setError(err.message || "Erreur d'initialisation. Système hors ligne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-[#0D0D0D]">
      
      {/* 1. Header & Stepper (Flux Naturel - Pas de Sticky) */}
      <header className="bg-white border-b border-slate-100">
        <ChallengeDetailHeader challenge={challenge} onStart={handleStartChallenge} />
        <div className="max-w-[1200px] mx-auto">
          <ChallengeStepper currentStep={currentStep} setStep={setCurrentStep} />
        </div>
      </header>

      {/* 2. Zone de Contenu Dynamique */}
      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-12 w-full">
        {currentStep === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contenu Principal (Brief & Specs) */}
            <div className="lg:col-span-8 space-y-12">
              <section className="bg-white border border-slate-100 rounded-xl p-8">
                <ChallengeBrief challenge={challenge} />
              </section>

              <section className="bg-white border border-slate-100 rounded-xl p-8">
                <ChallengeTechnicalSpecs challenge={challenge} />
              </section>
              
              {/* Action : Lancer le Challenge */}
              <div className="flex flex-col items-center gap-6 py-12 border-t border-slate-100">
                {error && (
                  <div className="flex items-center gap-3 text-[#EF4444] bg-[#EF4444]/5 px-6 py-3 rounded-lg border border-[#EF4444]/20 text-[11px] font-bold uppercase tracking-widest">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                
                <button 
                  onClick={handleStartChallenge}
                  disabled={loading}
                  className="group relative flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-[#0052FF] active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Terminal size={18} />
                  )}
                  <span>{loading ? "Chargement..." : "Démarrer la Mission"}</span>
                  {!loading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>

            {/* Sidebar (Flux Naturel) */}
            <aside className="lg:col-span-4">
              <div className="border-2 border-slate-900 rounded-xl p-1 bg-white shadow-[6px_6px_0px_0px_#0D0D0D]">
                 <ChallengeDetailSidebar challenge={challenge} />
              </div>
            </aside>
          </div>
        ) : (
          /* Autres étapes : Layout centré */
          <div className="max-w-4xl mx-auto">
            {currentStep === 2 && (
              <div className="border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
                <ChallengeSubmissionForm 
                  challengeId={challenge.id}
                  onSubmissionCreated={(id) => setSubmissionId(id)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <ChallengeAIFeedback  
                  challengeId={challenge.id}
                  submissionId={submissionId}
                  challengeTitle={challenge.title}
                  challengeContext={challenge.description}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-100 bg-slate-50/50 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-[#0052FF] rounded-full" />
                 <span>CORE_ID: {String(challenge.id).padStart(4, '0')}</span>
               </div>
               <span className="text-slate-200">/</span>
               <span>MODE: STEP_0{currentStep}</span>
            </div>

            <div className="flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar size={12} />
                <span>APRIL 2026</span>
              </div>
              <span className="text-slate-900 border-l border-slate-200 pl-8">BUILD_1.0.4</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}