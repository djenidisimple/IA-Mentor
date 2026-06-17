"use client";

import React from "react";
import { ShieldCheck, ClipboardList } from "lucide-react";
import { Challenge } from "@/types/challenge.types";

export default function ChallengeTechnicalSpecs({ challenge }: { challenge: Challenge }) {
  const requirements = [
    "Implémenter toutes les fonctionnalités spécifiées complètement",
    "Atteindre une performance optimale (réponse < 100ms)",
    "Maintenir une couverture de tests supérieure à 90%",
    "Respecter les conventions de style et de nommage du stack",
  ];

  const criteria = [
    { label: "Architecture", weight: "40%", description: "Solidité et scalabilité de la structure" },
    { label: "Qualité de Code", weight: "30%", description: "Clarté, tests et documentation" },
    { label: "Performance", weight: "30%", description: "Optimisation des ressources" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList size={16} className="text-[var(--orange)]" />
        <h2 className="text-xs font-bold text-[var(--navy)] uppercase tracking-widest">
          Spécifications & Évaluation
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-[var(--navy)] mb-4">Pré-requis d'implémentation</h3>
          <div className="space-y-3">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--orange)] mt-2 shrink-0" />
                <span className="text-xs text-[var(--gray)] leading-relaxed">{req}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--orange)]/5 rounded-xl p-5 border border-[var(--orange)]/10">
          <h3 className="text-sm font-bold text-[var(--navy)] mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[var(--orange)]" />
            Critères d'évaluation de l'IA
          </h3>
          <div className="space-y-4">
            {criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--navy)]">{c.label}</span>
                    <span className="text-xs text-[var(--orange)]">{c.weight}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--orange)]/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--orange)] rounded-full" style={{ width: c.weight }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
