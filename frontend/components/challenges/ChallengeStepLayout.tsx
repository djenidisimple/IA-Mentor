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
import { Calendar, Terminal, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { submissionsApi } from "@/lib/submissions";

interface ChallengeStepLayoutProps {
  challenge: Challenge;
}

export default function ChallengeStepLayout({ challenge }: ChallengeStepLayoutProps) {
  const [currentStep, setCurrentStep] = useState<ChallengeStep>(1);
  const [submissionId, setSubmissionId] = useState<number | null>(null); //  AJOUTÉ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartChallenge = async () => {
    setLoading(true);
    setError(null);
    try {
      await submissionsApi.start(challenge.id);
      setCurrentStep(2); // Go to submission only if API call succeeds
    } catch (err: any) {
      console.error("Failed to start challenge:", err);
      setError(err.message || "Erreur lors du démarrage du challenge. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] relative flex flex-col">
      {/* 1. Header (Fixed/Statique en haut) */}
      <ChallengeDetailHeader challenge={challenge} onStart={handleStartChallenge} />

      {/* 2. Stepper Navigation */}
      <ChallengeStepper currentStep={currentStep} setStep={setCurrentStep} />

      {/* 3. Dynamic Content Area */}
      <div className="flex-1 max-w-[1600px] mx-auto px-6 lg:px-8 pb-20 w-full">
        {currentStep === 1 ? (
          /* Step 1: Layout avec Sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 space-y-10">
              <ChallengeBrief challenge={challenge} />
              <ChallengeTechnicalSpecs challenge={challenge} />
              
              {/* Primary Action Button */}
              <div className="flex flex-col items-center gap-4 pt-8">
                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 text-xs font-mono mb-2">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}
                <button 
                  onClick={handleStartChallenge}
                  disabled={loading}
                  className="group relative inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-mono text-sm font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Terminal size={18} />
                  )}
                  <span>{loading ? "Initialisation..." : "Lancer le Challenge"}</span>
                  {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <ChallengeDetailSidebar challenge={challenge} />
              </div>
            </aside>
          </div>
        ) : (
          /* Autres étapes: Layout centré et large */
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentStep === 2 && (
              <ChallengeSubmissionForm 
                challengeId={challenge.id}
                onSubmissionCreated={(id) => setSubmissionId(id)} //  Callback for submissionId
              />
            )}

            {currentStep === 3 && (
              <ChallengeAIFeedback  
                challengeId={challenge.id}
                submissionId={submissionId} //  USE REAL SUBMISSION ID
                challengeTitle={challenge.title}
                challengeContext={challenge.description}
              />
            )}

            {currentStep === 4 && (
              <div className="bg-white border border-gray-100 rounded-xl p-20 text-center">
                <p className="font-mono text-gray-400">Community reviews coming soon...</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Footer */}
      <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            <div className="flex gap-4">
              <span>UID: {String(challenge.id).toUpperCase()}</span>
              <span className="hidden md:inline text-gray-200">|</span>
              <span className="hidden md:inline">Phase: {currentStep}/4</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} className="text-gray-300" />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-gray-900 font-bold">REL_v1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
