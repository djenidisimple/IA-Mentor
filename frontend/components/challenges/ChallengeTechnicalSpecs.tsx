"use client";

import React from "react";
import { ShieldCheck, ClipboardList, CheckCircle2 } from "lucide-react";
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
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 p-5 border-b border-gray-50 bg-gray-50/30">
        <ClipboardList size={16} className="text-amber-500" />
        <h2 className="font-mono text-xs font-bold text-gray-900 uppercase tracking-widest">
          Spécifications & Évaluation
        </h2>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Requirements */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            Pré-requis d'implémentation
          </h3>
          <div className="space-y-3">
            {requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-md bg-amber-400 mt-2 shrink-0" />
                <span className="text-xs text-gray-600 font-mono leading-relaxed">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div className="bg-amber-50/30 rounded-xl p-5 border border-amber-50">
          <h3 className="text-sm font-bold text-amber-900 mb-4 flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-500" />
            Critères d'évaluation de l'IA
          </h3>
          <div className="space-y-4">
            {criteria.map((c, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black font-mono text-amber-800 uppercase">{c.label}</span>
                    <span className="text-[10px] font-mono text-amber-600">{c.weight}</span>
                  </div>
                  <div className="h-1 bg-amber-100 rounded-md overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: c.weight }} />
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
