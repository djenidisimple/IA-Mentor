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
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 p-5 border-b border-gray-50 bg-gray-50/30">
        <BookOpen size={16} className="text-blue-500" />
        <h2 className="font-mono text-xs font-bold text-gray-900 uppercase tracking-widest">
          Le Briefing du Projet
        </h2>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Description */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            Description
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed font-sans">
            {challenge.description} 
            Cette mission teste votre capacité à concevoir et implémenter des solutions de niveau production 
            en utilisant <span className="text-blue-600 font-medium">{challenge.technologies?.slice(0, 3).join(', ')}</span> et d'autres technologies de pointe.
          </p>
        </div>

        {/* Technical Objectives */}
        <div className="bg-blue-50/30 rounded-xl p-5 border border-blue-50">
          <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Target size={16} className="text-blue-500" />
            Objectifs Techniques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-600 font-mono leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
