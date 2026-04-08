"use client";

import React from "react";
import { Sparkles, Brain, BarChart3, Terminal, ShieldCheck, Zap } from "lucide-react";

export default function ChallengeAIFeedback() {
  const metrics = [
    { label: "Code Quality", value: 85, icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Performance", value: 92, icon: Zap, color: "text-amber-500" },
    { label: "Architecture", value: 78, icon: Brain, color: "text-blue-500" },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 relative overflow-hidden group shadow-sm h-full">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <Sparkles size={120} />
      </div>

      <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        Analyse IA & Feedbacks
      </h3>

      <div className="space-y-6 relative z-10">
        {/* Waiting State (Default) */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-2xl mb-4 border border-emerald-100">
            <BarChart3 size={28} className="text-emerald-500" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Prêt pour l'analyse</h4>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto">
            Soumettez votre projet pour recevoir un rapport complet généré par notre IA Mentor.
          </p>
        </div>

        {/* Mock Metrics Grid */}
        <div className="grid grid-cols-1 gap-3 opacity-40 grayscale pointer-events-none select-none">
          {metrics.map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <m.icon size={14} className={m.color} />
                <span className="font-mono text-[10px] font-bold text-gray-600 uppercase">{m.label}</span>
              </div>
              <div className="font-mono text-xs font-black text-gray-400">--%</div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/50 border border-blue-100/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Terminal size={14} className="text-blue-500 mt-0.5" />
            <div className="text-[11px] text-blue-700 leading-relaxed font-mono">
              <span className="font-bold uppercase block mb-1">Moteur d'Analyse v4.2</span>
              L'IA vérifiera la structure, la complexité algorithmique et le respect des conventions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
