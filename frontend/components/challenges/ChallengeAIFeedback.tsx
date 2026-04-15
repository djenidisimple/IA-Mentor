"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Brain, 
  BarChart3, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Code,
  FileText,
  RefreshCw
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

  useEffect(() => {
    if (submissionId) {
      checkExistingAnalysis();
    }
  }, [submissionId]);

  const checkExistingAnalysis = async () => {
    if (!submissionId) return;

    setStatus('loading');
    try {
      const result = await analysisApi.getAnalysisResult(submissionId);
      
      if (result.status === 'COMPLETED') {
        setAnalysis(result);
        setStatus('completed');
      } else if (result.status === 'PENDING' || result.status === 'FETCHING' || result.status === 'ANALYZING') {
        setStatus('analyzing');
        setProgress(result.status === 'FETCHING' ? 'Récupération du code source...' : 'Analyse en cours...');
        pollAnalysisStatus();
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

  const pollAnalysisStatus = () => {
    const interval = setInterval(async () => {
      if (!submissionId) {
        clearInterval(interval);
        return;
      }

      try {
        const result = await analysisApi.getAnalysisResult(submissionId);
        
        if (result.status === 'COMPLETED') {
          setAnalysis(result);
          setStatus('completed');
          clearInterval(interval);
        } else if (result.status === 'FAILED') {
          setError("L'analyse a échoué. Veuillez réessayer.");
          setStatus('error');
          clearInterval(interval);
        } else {
          setProgress(getProgressMessage(result.status));
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  const getProgressMessage = (analysisStatus: string): string => {
    const messages: Record<string, string> = {
      'PENDING': 'En attente d\'analyse...',
      'FETCHING': 'Récupération du repository GitHub...',
      'ANALYZING': 'Analyse par Gemini AI en cours...',
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
      await analysisApi.analyzeSubmission(submissionId);
      setStatus('analyzing');
      setProgress('Analyse démarrée...');
      pollAnalysisStatus();
    } catch (err: any) {
      setError(err.message || "Erreur lors du démarrage de l'analyse");
      setStatus('error');
    }
  };

  const handleRetry = () => {
    setError(null);
    handleStartAnalysis();
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBackground = (score: number): string => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  // État : En attente de soumission
  if (!submissionId) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 relative overflow-hidden group shadow-sm h-full">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          <Sparkles size={120} />
        </div>

        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
          Analyse IA & Feedbacks
        </h3>

        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-4 border border-gray-200">
            <BarChart3 size={28} className="text-gray-400" />
          </div>
          <h4 className="font-bold text-gray-500 mb-2">En attente de soumission</h4>
          <p className="text-xs text-gray-400 leading-relaxed max-w-[200px] mx-auto">
            Soumettez votre projet GitHub pour recevoir une analyse détaillée.
          </p>
        </div>
      </div>
    );
  }

  // État : Chargement
  if (status === 'loading') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-mono text-gray-600">Préparation de l'analyse...</p>
        </div>
      </div>
    );
  }

  // État : Analyse en cours
  if (status === 'analyzing') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 h-full">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Analyse en cours
        </h3>

        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4 border border-blue-200">
            <Brain size={28} className="text-blue-500 animate-pulse" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Gemini AI analyse votre code</h4>
          <p className="text-xs text-gray-500 mb-4">{progress}</p>
          
          <div className="w-48 h-1.5 bg-gray-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full animate-progress" 
                 style={{ width: '60%', animation: 'progress 2s ease-in-out infinite' }} />
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              Récupération du code source
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              Analyse par Gemini AI
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              Génération du rapport
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État : Erreur
  if (status === 'error') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 h-full">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          Erreur d'analyse
        </h3>

        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-2xl mb-4 border border-red-200">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Analyse échouée</h4>
          <p className="text-xs text-gray-500 mb-4 max-w-[250px] mx-auto">{error}</p>
          
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-mono rounded-lg hover:bg-black transition-colors"
          >
            <RefreshCw size={12} />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // État : En attente de lancement
  if (status === 'idle') {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 relative overflow-hidden group shadow-sm h-full">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          <Sparkles size={120} />
        </div>

        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          Analyse IA & Feedbacks
        </h3>

        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-2xl mb-4 border border-emerald-100">
            <BarChart3 size={28} className="text-emerald-500" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Prêt pour l'analyse</h4>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[250px] mx-auto mb-6">
            Gemini AI analysera votre code pour évaluer la qualité, la performance et l'architecture.
          </p>
          
          <button
            onClick={handleStartAnalysis}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-mono font-bold rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            <Sparkles size={14} />
            Lancer l'analyse IA
          </button>
        </div>

        <div className="bg-blue-50/50 border border-blue-100/50 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <Terminal size={14} className="text-blue-500 mt-0.5" />
            <div className="text-[11px] text-blue-700 leading-relaxed font-mono">
              <span className="font-bold uppercase block mb-1">Gemini AI v2.0</span>
              Analyse de code, détection de patterns, suggestions d'amélioration et scoring automatique.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État : Analyse complétée
  const metrics = [
    { 
      label: "Code Quality", 
      value: analysis?.codeQualityMetrics?.complexityScore ? 
        Math.round(100 - (analysis.codeQualityMetrics.complexityScore * 10)) : 85,
      icon: ShieldCheck, 
      color: "text-emerald-500" 
    },
    { 
      label: "Performance", 
      value: analysis?.codeQualityMetrics?.maintainabilityIndex || 90,
      icon: Zap, 
      color: "text-amber-500" 
    },
    { 
      label: "Best Practices", 
      value: analysis?.codeQualityMetrics?.followsBestPractices ? 90 : 70,
      icon: CheckCircle2, 
      color: "text-blue-500" 
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 relative overflow-hidden group shadow-sm h-full">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
        <Sparkles size={120} />
      </div>

      <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        Analyse IA & Feedbacks
      </h3>

      <div className="space-y-4 relative z-10">
        {/* Score Principal */}
        <div className={`${getScoreBackground(analysis?.score || 0)} border rounded-xl p-4 text-center`}>
          <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Score Global</p>
          <p className={`text-4xl font-black font-mono ${getScoreColor(analysis?.score || 0)}`}>
            {analysis?.score || 0}
            <span className="text-sm text-gray-400 font-normal">/100</span>
          </p>
          <p className="text-[10px] font-mono text-gray-500 mt-1">
            Analysé par Gemini AI • {new Date(analysis?.completedAt || "").toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Résumé */}
        {analysis?.summary && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-xs text-gray-700 leading-relaxed font-mono">
              {analysis.summary}
            </p>
          </div>
        )}

        {/* Métriques */}
        <div className="grid grid-cols-1 gap-2">
          {metrics.map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <m.icon size={14} className={m.color} />
                <span className="font-mono text-[10px] font-bold text-gray-600 uppercase">{m.label}</span>
              </div>
              <div className="font-mono text-sm font-black text-gray-700">{m.value}%</div>
            </div>
          ))}
        </div>

        {/* Points Forts & Faibles */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/50">
            <div className="flex items-center gap-1 mb-2">
              <ThumbsUp size={12} className="text-emerald-600" />
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">Points forts</span>
            </div>
            <ul className="space-y-1">
              {analysis?.strengths?.slice(0, 2).map((s, i) => (
                <li key={i} className="text-[10px] font-mono text-emerald-700 flex items-start gap-1">
                  <span className="text-emerald-400">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100/50">
            <div className="flex items-center gap-1 mb-2">
              <ThumbsDown size={12} className="text-amber-600" />
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">À améliorer</span>
            </div>
            <ul className="space-y-1">
              {analysis?.weaknesses?.slice(0, 2).map((w, i) => (
                <li key={i} className="text-[10px] font-mono text-amber-700 flex items-start gap-1">
                  <span className="text-amber-400">•</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Suggestions */}
        {analysis?.suggestions && analysis.suggestions.length > 0 && (
          <div className="bg-blue-50/30 rounded-lg p-3 border border-blue-100/30">
            <div className="flex items-center gap-1 mb-2">
              <Lightbulb size={12} className="text-blue-600" />
              <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">Suggestions</span>
            </div>
            <ul className="space-y-1">
              {analysis.suggestions.slice(0, 3).map((s, i) => (
                <li key={i} className="text-[10px] font-mono text-blue-700 flex items-start gap-1">
                  <span className="text-blue-400">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Métriques détaillées */}
        {analysis?.codeQualityMetrics && (
          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-[9px] font-mono text-gray-400 uppercase">Fichiers</p>
                <p className="text-sm font-mono font-bold text-gray-700">
                  {analysis.codeQualityMetrics.filesAnalyzed || '—'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-gray-400 uppercase">Langages</p>
                <p className="text-sm font-mono font-bold text-gray-700">
                  {analysis.codeQualityMetrics.detectedLanguages?.length || '—'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-gray-400 uppercase">README</p>
                <p className="text-sm font-mono font-bold text-gray-700">
                  {analysis.codeQualityMetrics.hasReadme ? 'Oui' : 'Non'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-gray-400 uppercase">Tests</p>
                <p className="text-sm font-mono font-bold text-gray-700">
                  {analysis.codeQualityMetrics.hasTests ? 'Oui' : 'Non'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback détaillé */}
        {analysis?.detailedFeedback && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-1 mb-2">
              <FileText size={12} className="text-gray-600" />
              <span className="text-[10px] font-mono font-bold text-gray-600 uppercase">Feedback détaillé</span>
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed font-mono">
              {analysis.detailedFeedback.length > 200 
                ? analysis.detailedFeedback.substring(0, 200) + '...' 
                : analysis.detailedFeedback}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
