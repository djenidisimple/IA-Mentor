"use client";

import React from "react";
import { BookOpen, Target, CheckCircle2 } from "lucide-react";
import { Challenge } from "@/types/challenge.types";

export default function ChallengeBrief({ challenge }: { challenge: Challenge }) {
  const objectives = [
    "Conception d'une architecture système évolutive et maintenable",
    "Implémentation d'algorithmes efficaces avec une complexité optimale",
    "Écriture d'un code propre, testable et bien documenté",
    "Gestion des cas limites et des scénarios d'erreur avec élégance",
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={16} className="text-[var(--blue)]" />
        <h2 className="text-xs font-bold text-[var(--navy)] uppercase tracking-widest">
          Le Briefing du Projet
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-[var(--navy)] mb-3">Description</h3>
          <p className="text-sm text-[var(--gray)] leading-relaxed">
            {challenge.description}
          </p>
        </div>

        <div className="bg-[var(--blue)]/5 rounded-xl p-5 border border-[var(--blue)]/10">
          <h3 className="text-sm font-bold text-[var(--navy)] mb-4 flex items-center gap-2">
            <Target size={16} className="text-[var(--blue)]" />
            Objectifs Techniques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span className="text-xs text-[var(--gray)] leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
