"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles, Brain, BarChart3, Terminal, ShieldCheck,
  Zap, Loader2, AlertCircle, CheckCircle2, ThumbsUp,
  ThumbsDown, Lightbulb, FileText, RefreshCw, GitBranch,
  Activity, Target, Cpu, ChevronRight, Code2, Database
} from "lucide-react";
import { analysisApi, AnalysisResult } from "@/lib/analysis";

interface ChallengeAIFeedbackProps {
  submissionId: number | null;
  challengeId: number;
  challengeTitle?: string;
  challengeContext?: string;
}

export default function ChallengeAIFeedback({
  submissionId,
  challengeId,
  challengeTitle = "Challenge",
  challengeContext = ""
}: ChallengeAIFeedbackProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'analyzing' | 'completed' | 'error'>('idle');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [progressStep, setProgressStep] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animation d'entrée
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (submissionId) checkExistingAnalysis();
    if (analysis && analysis.status == "PENDING") {
      handleStartAnalysis();
    }
  }, [submissionId]);

  // Simulation de progression visuelle
  useEffect(() => {
    if (status === 'analyzing') {
      const timer = setInterval(() => {
        setProgressStep(prev => (prev < 2 ? prev + 1 : prev));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [status]);

  const startPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      if (!submissionId) {
        clearInterval(intervalRef.current!);
        return;
      }
      try {
        const result = await analysisApi.getAnalysisResult(submissionId);
        if (result.status === 'COMPLETED') {
          setAnalysis(result);
          setStatus('completed');
          clearInterval(intervalRef.current!);
        } else if (result.status === 'FAILED') {
          setError("L'analyse a échoué. Veuillez réessayer.");
          setStatus('error');
          clearInterval(intervalRef.current!);
        } else {
          setProgress(getProgressMessage(result.status));
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);
  };

  const checkExistingAnalysis = async () => {
    if (!submissionId) return;
    setStatus('loading');
    try {
      const result = await analysisApi.getAnalysisResult(submissionId);
      if (result.status === 'COMPLETED') {
        setAnalysis(result);
        setStatus('completed');
      } else if (['PENDING', 'FETCHING', 'ANALYZING'].includes(result.status)) {
        setStatus('analyzing');
        setProgress(getProgressMessage(result.status));
        startPolling();
      } else {
        setStatus('idle');
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setStatus('idle');
      } else {
        setError(err.message || "Erreur lors de la vérification de l'analyse");
        setStatus('error');
      }
    }
  };

  const getProgressMessage = (analysisStatus: string): string => {
    const messages: Record<string, string> = {
      'PENDING': "En attente d'analyse...",
      'FETCHING': 'Récupération du repository GitHub...',
      'ANALYZING': 'Analyse par Groq AI en cours...',
    };
    return messages[analysisStatus] || 'Traitement en cours...';
  };

  const handleStartAnalysis = async () => {
    if (!submissionId) {
      setError("Aucune soumission trouvée. Soumettez d'abord votre projet.");
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      setStatus('analyzing');
      setProgress('Analyse démarrée...');
      setProgressStep(0);
      startPolling();
    } catch (err: any) {
      setError(err.message || "Erreur lors du démarrage de l'analyse");
      setStatus('error');
    }
  };

  const handleRetry = () => {
    setError(null);
    handleStartAnalysis();
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Score Ring Component (CSS pur)
  const ScoreRing = ({ score }: { score: number | null }) => {
    const validScore = score ?? 0;
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (validScore / 100) * circumference;

    const getColorClass = () => {
      if (validScore >= 80) return "text-emerald-500";
      if (validScore >= 60) return "text-amber-500";
      return "text-rose-500";
    };

    return (
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            cx="60" cy="60" r={radius}
            strokeWidth="5"
            stroke="currentColor"
            className="text-slate-100"
            fill="transparent"
          />
          <circle
            cx="60" cy="60" r={radius}
            strokeWidth="5"
            stroke="currentColor"
            className={`${getColorClass()} transition-all duration-1000 ease-out`}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black tabular-nums ${getColorClass()}`}>
            {score ?? '—'}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">/100</span>
        </div>
      </div>
    );
  };

  // Styles d'animation personnalisés
  const customStyles = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .animate-slide-in {
      animation: slideIn 0.4s ease-out forwards;
    }
    .animate-scale-in {
      animation: scaleIn 0.3s ease-out forwards;
    }
    .animate-pulse-glow {
      animation: pulseGlow 2s ease-in-out infinite;
    }
  `;

  // ÉTAT : Pas de soumission
  if (!submissionId) {
    return (
      <>
        <style>{customStyles}</style>
        <div className={`relative h-full w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
            <div className="rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 p-1.5 text-white">
              <Cpu size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-slate-700">Analyse IA</h3>
              <p className="font-mono text-[10px] text-slate-400">En attente</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4">
              <BarChart3 size={40} className="text-slate-300" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800">En attente de soumission</h4>
            <p className="mt-1 max-w-xs text-sm text-slate-500">
              Soumettez votre projet GitHub pour recevoir une analyse détaillée.
            </p>
          </div>
        </div>
      </>
    );
  }

  // ÉTAT : Chargement initial
  if (status === 'loading') {
    return (
      <>
        <style>{customStyles}</style>
        <div className="relative h-full w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
            <div className="rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 p-1.5 text-white">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-slate-700">Initialisation</h3>
              <p className="font-mono text-[10px] text-slate-400">Préparation...</p>
            </div>
          </div>
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        </div>
      </>
    );
  }

  // ÉTAT : Analyse en cours
  if (status === 'analyzing') {
    return (
      <>
        <style>{customStyles}</style>
        <div className="relative h-full w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 p-1.5 text-white shadow-md shadow-orange-500/20">
                <Brain size={16} className="animate-pulse-glow" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-700">Analyse en cours</h3>
                <p className="font-mono text-[10px] text-slate-400">Groq AI • Llama 3.3</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700 border border-orange-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              </span>
              En cours
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-8">
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/20"></div>
              <div className="absolute inset-4 animate-pulse rounded-full bg-orange-500/30"></div>
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                <Brain size={28} className="text-orange-500" />
              </div>
            </div>

            <h4 className="text-lg font-semibold text-slate-800">Groq AI analyse votre code</h4>
            <p className="mt-1 text-sm text-slate-500">{progress}</p>

            {/* Barre de progression */}
            <div className="mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-slate-100">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 ease-out"
                style={{ width: `${(progressStep + 1) * 33.33}%` }}
              />
            </div>

            {/* Étapes */}
            <div className="mt-8 w-full max-w-xs space-y-3">
              {[
                { label: "Récupération du code source", icon: GitBranch },
                { label: "Analyse par Groq AI", icon: Brain },
                { label: "Génération du rapport", icon: FileText },
              ].map((step, idx) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                    idx < progressStep ? 'bg-emerald-100 text-emerald-700' : 
                    idx === progressStep ? 'bg-orange-100 text-orange-700 scale-110 ring-2 ring-orange-500/30' : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {idx < progressStep ? <CheckCircle2 size={14} /> : idx + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <step.icon size={12} className={idx <= progressStep ? 'text-slate-600' : 'text-slate-300'} />
                    <span className={`text-sm font-medium ${
                      idx <= progressStep ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx === progressStep && (
                    <Loader2 size={14} className="ml-auto animate-spin text-orange-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ÉTAT : Erreur
  if (status === 'error') {
    return (
      <>
        <style>{customStyles}</style>
        <div className="relative h-full w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
            <div className="rounded-lg bg-gradient-to-br from-rose-500 to-red-500 p-1.5 text-white">
              <AlertCircle size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-slate-700">Erreur d'analyse</h3>
              <p className="font-mono text-[10px] text-slate-400">Échec</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 rounded-full bg-rose-50 p-4">
              <AlertCircle size={32} className="text-rose-500" />
            </div>
            <h4 className="text-lg font-semibold text-slate-800">Analyse échouée</h4>
            <p className="mt-1 max-w-xs text-sm text-slate-500">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
            >
              <RefreshCw size={14} />
              Réessayer
            </button>
          </div>
        </div>
      </>
    );
  }

  // ÉTAT : En attente de lancement
  if (status === 'idle') {
    return (
      <>
        <style>{customStyles}</style>
        <div className={`relative h-full w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5 text-white shadow-md shadow-emerald-500/20">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-slate-700">Analyse IA Disponible</h3>
              <p className="font-mono text-[10px] text-slate-400">Groq • Llama 3.3 70B</p>
            </div>
          </div>

          <div className="p-6">
            <div className="animate-slide-in flex flex-col items-center text-center">
              <div className="mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-100">
                <BarChart3 size={40} className="text-emerald-500" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">Prêt pour l'analyse</h4>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Groq AI analysera votre code pour évaluer la qualité, la performance et l'architecture.
              </p>

              {/* Features */}
              <div className="mt-6 grid w-full grid-cols-3 gap-2">
                {[
                  { icon: Target, label: "Adéquation", color: "emerald" },
                  { icon: ShieldCheck, label: "Qualité", color: "blue" },
                  { icon: Activity, label: "Performance", color: "amber" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1 rounded-lg bg-slate-50 p-2">
                    <Icon size={14} className={`text-${color}-500`} />
                    <span className="text-[10px] font-medium text-slate-600">{label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartAnalysis}
                className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 active:scale-[0.98]"
              >
                <Sparkles size={16} />
                Lancer l'analyse IA
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50/50 p-3 border border-blue-100">
                <Terminal size={14} className="text-blue-500 shrink-0" />
                <p className="text-[10px] text-blue-700 font-mono">
                  <span className="font-bold">Groq AI • Llama 3.3 70B</span><br />
                  Analyse de code, détection de patterns et scoring automatique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ÉTAT : Complété (Résultats)
  const metrics = [
    {
      label: "Qualité",
      value: analysis?.codeQualityMetrics?.complexityScore
        ? Math.max(0, Math.round(100 - analysis.codeQualityMetrics.complexityScore * 10))
        : null,
      icon: ShieldCheck,
      color: "emerald"
    },
    {
      label: "Maintenabilité",
      value: analysis?.codeQualityMetrics?.maintainabilityIndex ?? null,
      icon: Zap,
      color: "amber"
    },
    {
      label: "Commentaires",
      value: analysis?.codeQualityMetrics?.commentRatio != null
        ? Math.round(analysis.codeQualityMetrics.commentRatio * 100)
        : null,
      icon: Code2,
      color: "blue"
    },
  ];

  return (
    <>
      <style>{customStyles}</style>
      <div className={`relative h-full w-full rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/20 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-1.5 text-white shadow-md shadow-emerald-500/20">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-slate-700">Analyse IA</h3>
              <p className="font-mono text-[10px] text-slate-400">
                Groq AI • {formatDate(analysis?.completedAt ?? null)}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={10} /> Complété
          </span>
        </div>

        {/* Content */}
        <div className="animate-scale-in space-y-5 p-6">
          
          {/* Score + Summary */}
          <div className="flex items-start gap-5">
            <ScoreRing score={analysis?.score ?? null} />
            <div className="flex-1 space-y-2 pt-2">
              {analysis?.summary && (
                <p className="text-sm font-medium leading-relaxed text-slate-600">
                  {analysis.summary}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                  <GitBranch size={10} /> {analysis?.codeQualityMetrics?.filesAnalyzed || 0} fichiers
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                  <Database size={10} /> {analysis?.codeQualityMetrics?.detectedLanguages?.length || 0} langages
                </span>
              </div>
            </div>
          </div>

          {/* Métriques */}
          <div className="grid grid-cols-3 gap-2">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                <metric.icon size={14} className={`mx-auto mb-1 text-${metric.color}-500`} />
                <p className="text-xl font-black tabular-nums text-slate-800">
                  {metric.value != null ? metric.value : '—'}
                  {metric.value != null && <span className="text-[9px] font-normal text-slate-400">%</span>}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Forces & Faiblesses */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-emerald-50/20 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <ThumbsUp size={12} className="text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Points forts</span>
              </div>
              <ul className="space-y-1.5">
                {analysis?.strengths?.slice(0, 2).map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-800">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500"></span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-amber-50/20 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <ThumbsDown size={12} className="text-amber-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">À améliorer</span>
              </div>
              <ul className="space-y-1.5">
                {analysis?.weaknesses?.slice(0, 2).map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-amber-800">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500"></span>
                    <span className="leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          {analysis?.suggestions && analysis.suggestions.length > 0 && (
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/30 to-blue-50/10 p-3">
              <div className="mb-2 flex items-center gap-1.5">
                <Lightbulb size={12} className="text-blue-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Suggestions</span>
              </div>
              <ul className="space-y-1.5">
                {analysis.suggestions.slice(0, 2).map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-blue-800">
                    <span className="text-blue-400">→</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Métriques détaillées */}
          {analysis?.codeQualityMetrics && (
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <div className="grid grid-cols-4 gap-1 text-center">
                {[
                  { label: "Fichiers", value: analysis.codeQualityMetrics.filesAnalyzed || '—' },
                  { label: "Langages", value: analysis.codeQualityMetrics.detectedLanguages?.length || '—' },
                  { label: "README", value: analysis.codeQualityMetrics.hasReadme ? '✓' : '✗' },
                  { label: "Tests", value: analysis.codeQualityMetrics.hasTests ? '✓' : '✗' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="text-sm font-bold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback détaillé - Accordéon CSS pur */}
          {analysis?.detailedFeedback && (
            <details className="group rounded-xl border border-slate-200 bg-slate-50/30 transition-all">
              <summary className="flex cursor-pointer list-none items-center justify-between p-3 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-2">
                  <FileText size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Feedback détaillé</span>
                </span>
                <ChevronRight size={12} className="transition-transform duration-200 group-open:rotate-90" />
              </summary>
              <div className="border-t border-slate-200 p-3 text-[11px] leading-relaxed text-slate-600">
                {analysis.detailedFeedback.length > 250
                  ? analysis.detailedFeedback.substring(0, 250) + '...'
                  : analysis.detailedFeedback}
              </div>
            </details>
          )}
        </div>
      </div>
    </>
  );
}