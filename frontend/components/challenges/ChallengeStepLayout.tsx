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
import { Terminal, ChevronRight, Loader2, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      <header className="bg-white border-b border-[var(--border-pink)]">
        <ChallengeDetailHeader challenge={challenge} onStart={handleStartChallenge} />
        <div className="max-w-[1200px] mx-auto">
          <ChallengeStepper currentStep={currentStep} setStep={setCurrentStep} />
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] mx-auto px-6 py-8 sm:py-12 w-full">
        {currentStep === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <ChallengeBrief challenge={challenge} />
              </section>

              <section className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <ChallengeTechnicalSpecs challenge={challenge} />
              </section>

              <div className="flex flex-col items-center gap-6 py-8 sm:py-12 border-t border-[var(--border-pink)]">
                {error && (
                  <div className="flex items-center gap-3 text-red-600 bg-red-50 px-6 py-3 rounded-full border border-red-200 text-[11px] font-bold uppercase tracking-widest">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleStartChallenge}
                  disabled={loading}
                  className="group inline-flex items-center gap-3 bg-[var(--navy)] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all hover:bg-[#2A3050] shadow-lg shadow-[var(--navy)]/10 active:scale-95 disabled:opacity-50"
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

            <aside className="lg:col-span-4">
              <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-5 sm:p-6">
                <ChallengeDetailSidebar challenge={challenge} />
              </div>
            </aside>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {currentStep === 2 && (
              <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-8 md:p-12">
                <ChallengeSubmissionForm
                  challengeId={challenge.id}
                  onSubmissionCreated={(id) => setSubmissionId(id)}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl overflow-hidden">
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

      <footer className="border-t border-[var(--border-pink)] bg-white py-8 sm:py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[var(--gray)]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[var(--blue)] rounded-full" />
                <span>CORE_ID: {String(challenge.id).padStart(4, '0')}</span>
              </div>
              <span className="text-[var(--border-pink)]">/</span>
              <span>MODE: STEP_0{currentStep}</span>
            </div>

            <div className="flex items-center gap-6 text-[10px] font-bold text-[var(--gray)] uppercase tracking-widest">
              <span>BUILD_1.0.4</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
