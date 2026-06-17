"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles, Brain, BarChart3, ShieldCheck,
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
      'ANALYZING': 'Analyse par IA en cours...',
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

  const ScoreRing = ({ score }: { score: number | null }) => {
    const validScore = score ?? 0;
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (validScore / 100) * circumference;

    const getColor = () => {
      if (validScore >= 80) return "#10B981";
      if (validScore >= 60) return "#FF8C42";
      return "#EF4444";
    };

    return (
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            cx="60" cy="60" r={radius}
            strokeWidth="5"
            stroke="var(--border-pink)"
            fill="transparent"
          />
          <circle
            cx="60" cy="60" r={radius}
            strokeWidth="5"
            stroke={getColor()}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black tabular-nums" style={{ color: getColor() }}>
            {score ?? '—'}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--gray)]">/100</span>
        </div>
      </div>
    );
  };

  if (!submissionId) {
    return (
      <div className={`p-6 sm:p-8 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="rounded-lg bg-[var(--navy)] p-1.5 text-white">
            <Cpu size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)]">Analyse IA</h3>
            <p className="text-[10px] font-bold text-[var(--gray)]">En attente</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-6 rounded-2xl bg-[var(--cream)] p-4 border border-[var(--border-pink)]">
            <BarChart3 size={40} className="text-[var(--gray)]" />
          </div>
          <h4 className="text-lg font-bold text-[var(--navy)]">En attente de soumission</h4>
          <p className="mt-1 max-w-xs text-sm text-[var(--gray)]">
            Soumettez votre projet GitHub pour recevoir une analyse détaillée.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="rounded-lg bg-[var(--navy)] p-1.5 text-white">
            <Loader2 size={16} className="animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)]">Initialisation</h3>
            <p className="text-[10px] font-bold text-[var(--gray)]">Préparation...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--orange)]" />
        </div>
      </div>
    );
  }

  if (status === 'analyzing') {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-[var(--orange)] to-[var(--yellow)] p-1.5 text-white shadow-md">
              <Brain size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--navy)]">Analyse en cours</h3>
              <p className="text-[10px] font-bold text-[var(--gray)]">IA • Analyse de code</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[var(--orange)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--orange)] border border-[var(--orange)]/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--orange)] opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--orange)]"></span>
            </span>
            En cours
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-[var(--orange)]/20"></div>
            <div className="absolute inset-4 animate-pulse rounded-full bg-[var(--orange)]/30"></div>
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg border border-[var(--border-pink)]">
              <Brain size={28} className="text-[var(--orange)]" />
            </div>
          </div>

          <h4 className="text-lg font-bold text-[var(--navy)]">L&apos;IA analyse votre code</h4>
          <p className="mt-1 text-sm text-[var(--gray)]">{progress}</p>

          <div className="mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-[var(--border-pink)]">
            <div
              className="h-full bg-gradient-to-r from-[var(--orange)] to-[var(--yellow)] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${(progressStep + 1) * 33.33}%` }}
            />
          </div>

          <div className="mt-8 w-full max-w-xs space-y-3">
            {[
              { label: "Récupération du code source", icon: GitBranch },
              { label: "Analyse par IA", icon: Brain },
              { label: "Génération du rapport", icon: FileText },
            ].map((step, idx) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                  idx < progressStep ? 'bg-green-100 text-green-700' :
                  idx === progressStep ? 'bg-[var(--orange)]/10 text-[var(--orange)] scale-110 ring-2 ring-[var(--orange)]/30' :
                  'bg-[var(--border-pink)] text-[var(--gray)]'
                }`}>
                  {idx < progressStep ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                <div className="flex items-center gap-2">
                  <step.icon size={12} className={idx <= progressStep ? 'text-[var(--navy)]' : 'text-[var(--gray)]'} />
                  <span className={`text-sm font-bold ${
                    idx <= progressStep ? 'text-[var(--navy)]' : 'text-[var(--gray)]'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx === progressStep && (
                  <Loader2 size={14} className="ml-auto animate-spin text-[var(--orange)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="rounded-lg bg-red-500 p-1.5 text-white">
            <AlertCircle size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)]">Erreur d'analyse</h3>
            <p className="text-[10px] font-bold text-[var(--gray)]">Échec</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-6 rounded-full bg-red-50 p-4 border border-red-200">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h4 className="text-lg font-bold text-[var(--navy)]">Analyse échouée</h4>
          <p className="mt-1 max-w-xs text-sm text-[var(--gray)]">{error}</p>
          <button
            onClick={handleRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-pink)] bg-white px-6 py-2.5 text-sm font-bold text-[var(--navy)] shadow-sm transition-all hover:bg-gray-50 active:scale-95"
          >
            <RefreshCw size={14} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <div className={`p-6 sm:p-8 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2 mb-6">
          <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-1.5 text-white shadow-md">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)]">Analyse IA Disponible</h3>
            <p className="text-[10px] font-bold text-[var(--gray)]">Analyse de code</p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 rounded-2xl bg-green-50 p-4 border border-green-100">
            <BarChart3 size={40} className="text-green-500" />
          </div>
          <h4 className="text-lg font-bold text-[var(--navy)]">Prêt pour l'analyse</h4>
          <p className="mt-1 max-w-xs text-sm text-[var(--gray)]">
            L&apos;IA analysera votre code pour évaluer la qualité, la performance et l&apos;architecture.
          </p>

          <div className="mt-6 grid w-full grid-cols-3 gap-2 max-w-xs">
            {[
              { icon: Target, label: "Adéquation", color: "green" },
              { icon: ShieldCheck, label: "Qualité", color: "blue" },
              { icon: Activity, label: "Performance", color: "orange" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-lg bg-[var(--cream)] p-3 border border-[var(--border-pink)]">
                <Icon size={14} className={`text-${color}-500`} />
                <span className="text-[10px] font-bold text-[var(--gray)]">{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleStartAnalysis}
            className="group mt-8 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Sparkles size={16} />
            Lancer l'analyse IA
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      label: "Qualité",
      value: analysis?.codeQualityMetrics?.complexityScore
        ? Math.max(0, Math.round(100 - analysis.codeQualityMetrics.complexityScore * 10))
        : null,
      icon: ShieldCheck,
      color: "green"
    },
    {
      label: "Maintenabilité",
      value: analysis?.codeQualityMetrics?.maintainabilityIndex ?? null,
      icon: Zap,
      color: "orange"
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
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[var(--border-pink)]">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-1.5 text-white shadow-md">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--navy)]">Analyse IA</h3>
            <p className="text-[10px] font-bold text-[var(--gray)]">
              Complété le {formatDate(analysis?.completedAt ?? null)}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 border border-green-200">
          <CheckCircle2 size={10} /> Complété
        </span>
      </div>

      <div className="space-y-5 p-6 sm:p-8">
        <div className="flex items-start gap-5">
          <ScoreRing score={analysis?.score ?? null} />
          <div className="flex-1 space-y-2 pt-2">
            {analysis?.summary && (
              <p className="text-sm font-medium leading-relaxed text-[var(--gray)]">
                {analysis.summary}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cream)] px-2.5 py-1 text-[10px] font-bold text-[var(--gray)] border border-[var(--border-pink)]">
                <GitBranch size={10} /> {analysis?.codeQualityMetrics?.filesAnalyzed || 0} fichiers
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cream)] px-2.5 py-1 text-[10px] font-bold text-[var(--gray)] border border-[var(--border-pink)]">
                <Database size={10} /> {analysis?.codeQualityMetrics?.detectedLanguages?.length || 0} langages
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-[var(--border-pink)] bg-white p-3 text-center">
              <metric.icon size={14} className={`mx-auto mb-1 text-${metric.color}-500`} />
              <p className="text-xl font-black tabular-nums text-[var(--navy)]">
                {metric.value != null ? metric.value : '—'}
                {metric.value != null && <span className="text-[9px] font-normal text-[var(--gray)]">%</span>}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--gray)]">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-green-50/50 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <ThumbsUp size={12} className="text-green-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">Points forts</span>
            </div>
            <ul className="space-y-1.5">
              {analysis?.strengths?.slice(0, 2).map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-green-800">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-green-500"></span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--orange)]/20 bg-gradient-to-br from-[var(--orange)]/5 to-[var(--orange)]/5 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <ThumbsDown size={12} className="text-[var(--orange)]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--orange)]">À améliorer</span>
            </div>
            <ul className="space-y-1.5">
              {analysis?.weaknesses?.slice(0, 2).map((w, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-[var(--orange)]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--orange)]"></span>
                  <span className="leading-relaxed">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {analysis?.suggestions && analysis.suggestions.length > 0 && (
          <div className="rounded-xl border border-[var(--blue)]/20 bg-gradient-to-br from-[var(--blue)]/5 to-[var(--blue)]/5 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Lightbulb size={12} className="text-[var(--blue)]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--blue)]">Suggestions</span>
            </div>
            <ul className="space-y-1.5">
              {analysis.suggestions.slice(0, 2).map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-[var(--blue)]">
                  <span className="text-[var(--blue)]">→</span>
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis?.codeQualityMetrics && (
          <div className="rounded-xl border border-[var(--border-pink)] bg-[var(--cream)] p-3">
            <div className="grid grid-cols-4 gap-1 text-center">
              {[
                { label: "Fichiers", value: analysis.codeQualityMetrics.filesAnalyzed || '—' },
                { label: "Langages", value: analysis.codeQualityMetrics.detectedLanguages?.length || '—' },
                { label: "README", value: analysis.codeQualityMetrics.hasReadme ? '✓' : '✗' },
                { label: "Tests", value: analysis.codeQualityMetrics.hasTests ? '✓' : '✗' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--gray)]">{label}</p>
                  <p className="text-sm font-bold text-[var(--navy)]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis?.detailedFeedback && (
          <details className="group rounded-xl border border-[var(--border-pink)] bg-[var(--cream)] transition-all">
            <summary className="flex cursor-pointer list-none items-center justify-between p-3 text-sm font-bold text-[var(--navy)]">
              <span className="flex items-center gap-2">
                <FileText size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Feedback détaillé</span>
              </span>
              <ChevronRight size={12} className="transition-transform duration-200 group-open:rotate-90" />
            </summary>
            <div className="border-t border-[var(--border-pink)] p-3 text-[11px] leading-relaxed text-[var(--gray)]">
              {analysis.detailedFeedback.length > 250
                ? analysis.detailedFeedback.substring(0, 250) + '...'
                : analysis.detailedFeedback}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
