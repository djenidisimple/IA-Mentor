"use client";

import React from "react";

export type ChallengeStep = 1 | 2 | 3 | 4;

interface ChallengeStepperProps {
  currentStep: ChallengeStep;
  setStep: (step: ChallengeStep) => void;
}

export default function ChallengeStepper({ currentStep, setStep }: ChallengeStepperProps) {
  const steps = [
    { id: 1 as const, step: "Step 1", title: "Start challenge" },
    { id: 2 as const, step: "Step 2", title: "Submit solution" },
    { id: 3 as const, step: "Step 3", title: "Improve solution" },
    { id: 4 as const, step: "Step 4", title: "Review solutions" },
  ];

  return (
    <div className="w-full border-b border-gray-200 bg-white/50 backdrop-blur-md mb-8">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
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
                <div className={`font-mono text-[10px] uppercase tracking-widest mb-1 
                                ${isActive ? "text-blue-600 font-bold" : "text-gray-500"}`}>
                  {s.step}
                </div>
                <div className={`font-['Syne'] text-sm md:text-base font-bold
                                ${isActive ? "text-gray-900" : "text-gray-600"}`}>
                  {s.title}
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in slide-in-from-left duration-300" />
                )}
                
                {/* Hover Indicator */}
                {!isActive && (
                  <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-gray-200 transition-all duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
