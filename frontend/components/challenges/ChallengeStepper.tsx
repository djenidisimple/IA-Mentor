"use client";

import React from "react";

export type ChallengeStep = 1 | 2 | 3;

interface ChallengeStepperProps {
  currentStep: ChallengeStep;
  setStep: (step: ChallengeStep) => void;
}

export default function ChallengeStepper({ currentStep, setStep }: ChallengeStepperProps) {
  const steps = [
    { id: 1 as const, step: "Étape 1", title: "Démarrer le défi" },
    { id: 2 as const, step: "Étape 2", title: "Soumettre la solution" },
    { id: 3 as const, step: "Étape 3", title: "Voir les résultats" },
  ];

  return (
    <div className="w-full border-b border-[var(--border-pink)] bg-white/50 backdrop-blur-md mb-8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex overflow-x-auto no-scrollbar">
          {steps.map((s) => {
            const isActive = currentStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex-1 min-w-[200px] py-6 px-4 text-left transition-all relative group
                           ${isActive ? "opacity-100" : "opacity-40 hover:opacity-60"}`}
              >
                <div className={`text-[10px] font-bold uppercase tracking-widest mb-1
                                ${isActive ? "text-[var(--blue)]" : "text-[var(--gray)]"}`}>
                  {s.step}
                </div>
                <div className={`text-sm md:text-base font-bold
                                ${isActive ? "text-[var(--navy)]" : "text-[var(--gray)]"}`}>
                  {s.title}
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--blue)] animate-fade-up" />
                )}
                {!isActive && (
                  <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-[var(--border-pink)] transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
