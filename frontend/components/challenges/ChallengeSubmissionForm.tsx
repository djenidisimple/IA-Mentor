"use client";

import React, { useState } from "react";
import { Send, GitBranch, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ChallengeSubmissionForm({ challengeId }: { challengeId: number }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulation d'envoi
    setTimeout(() => setStatus('success'), 1500);
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-3 shadow-sm">
          <CheckCircle2 className="text-emerald-500" size={24} />
        </div>
        <h4 className="font-mono text-sm font-bold text-emerald-900">Soumission réussie !</h4>
        <p className="text-[11px] font-mono text-emerald-600 mt-1">Votre projet est en cours de revue.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 relative overflow-hidden group transition-all hover:border-blue-200 shadow-sm">
      <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Send size={80} />
      </div>

      <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
        Valider le challenge
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block font-mono text-[10px] text-gray-400 uppercase mb-1.5 ml-1">Repository URL</label>
          <div className="relative">
            <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input 
              required
              type="url" 
              placeholder="https://github.com/username/repo"
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 pl-9 pr-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] text-gray-400 uppercase mb-1.5 ml-1">Commentaires / Description</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-300" size={14} />
            <textarea 
              required
              rows={3}
              placeholder="Détails techniques, difficultés rencontrées..."
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 pl-9 pr-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-gray-900 hover:bg-black text-white font-mono text-xs uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
        >
          {status === 'submitting' ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Soumettre le projet
              <Send size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}