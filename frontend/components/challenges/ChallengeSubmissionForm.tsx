"use client";

import React, { useState, useEffect } from "react";
import { Send, GitBranch, MessageSquare, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { submissionsApi } from "@/lib/submissions";
import { GithubIcon } from "../icon";

// Types
interface ExistingSubmission {
  id: number;
  challengeId: number;
  githubUrl?: string;
  status: string;
  submittedAt?: string;
}

interface SubmissionResponse {
  id: number;
  challengeId: number;
  githubUrl?: string;
  status: string;
  submittedAt?: string;
  startedAt: string;
}

// Fonction de validation d'URL GitHub
const validateGithubUrl = (url: string): { isValid: boolean; error: string } => {
  if (!url || url.trim() === "") {
    return { isValid: false, error: "L'URL GitHub est requise" };
  }

  const githubPatterns = [
    /^https?:\/\/github\.com\/[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+\/?$/,
    /^https?:\/\/github\.com\/[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+\.git$/,
    /^https?:\/\/github\.com\/[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+\/tree\/[a-zA-Z0-9\-_.\/]+$/,
    /^https?:\/\/github\.com\/[a-zA-Z0-9\-_.]+\/[a-zA-Z0-9\-_.]+\/blob\/[a-zA-Z0-9\-_.\/]+$/,
  ];

  const isValid = githubPatterns.some((pattern) => pattern.test(url.trim()));

  if (!isValid) {
    return {
      isValid: false,
      error: "URL GitHub invalide. Format attendu : https://github.com/username/repository",
    };
  }

  if (!url.includes("github.com")) {
    return { isValid: false, error: "L'URL doit pointer vers github.com" };
  }

  const parts = url.split("/");
  const username = parts[3];
  const repo = parts[4]?.replace(".git", "");

  if (!username || username.length < 1) {
    return { isValid: false, error: "Nom d'utilisateur GitHub manquant" };
  }

  if (!repo || repo.length < 1) {
    return { isValid: false, error: "Nom du repository manquant" };
  }

  return { isValid: true, error: "" };
};

export default function ChallengeSubmissionForm({ 
  challengeId,
  onSubmissionCreated
}: { 
  challengeId: number;
  onSubmissionCreated?: (submissionId: number) => void; //  CALLBACK
}) {
  const [status, setStatus] = useState<"loading" | "idle" | "submitting" | "success" | "already-submitted">("loading");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<ExistingSubmission | null>(null);

  // Vérifier si le challenge est déjà soumis au chargement
  useEffect(() => {
    const checkExistingSubmission = async () => {
      try {
        const submissions: SubmissionResponse[] = await submissionsApi.getMyActivity();

        const submission = submissions.find(
          (s) => s.challengeId === challengeId && s.githubUrl
        );

        if (submission && submission.githubUrl) {
          setExistingSubmission(submission);
          setStatus("already-submitted");
          setGithubUrl(submission.githubUrl);
          //  CALL CALLBACK FOR EXISTING SUBMISSION
          onSubmissionCreated?.(submission.id);
        } else {
          setStatus("idle");
        }
      } catch (err) {
        console.error("Erreur lors de la verification des soumissions:", err);
        setStatus("idle");
      }
    };

    checkExistingSubmission();
  }, [challengeId, onSubmissionCreated]);

  // Validation en temps réel
  const handleUrlChange = (value: string): void => {
    setGithubUrl(value);

    if (value.trim() === "") {
      setUrlError(null);
      return;
    }

    const validation = validateGithubUrl(value);
    setUrlError(validation.error || null);
  };

  // Validation au blur
  const handleUrlBlur = (): void => {
    if (githubUrl.trim() === "") {
      setUrlError("L'URL GitHub est requise");
    } else {
      const validation = validateGithubUrl(githubUrl);
      setUrlError(validation.error || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const validation = validateGithubUrl(githubUrl);
    if (!validation.isValid) {
      setUrlError(validation.error);
      setError(validation.error);
      return;
    }

    setStatus("submitting");

    try {
      const response = await submissionsApi.submit(challengeId, githubUrl.trim());

      if (response) {
        setExistingSubmission(response);
        //  CALL CALLBACK WITH SUBMISSION ID
        onSubmissionCreated?.(response.id);
      }

      setStatus("success");
    } catch (err: unknown) {
      console.error("Submission failed:", err);

      const error = err as { response?: { status?: number; data?: { message?: string; data?: ExistingSubmission } }; message?: string };

      if (error.response?.status === 409) {
        if (error.response.data?.data) {
          setExistingSubmission(error.response.data.data);
        }
        setStatus("already-submitted");
        return;
      }

      if (error.response?.status === 404) {
        setError("Repository GitHub introuvable. Verifiez que le repository existe et est public.");
      } else if (error.response?.status === 403) {
        setError("Acces refuse. Assurez-vous que le repository est public.");
      } else if (error.response?.data?.message) {
        if (error.response.data.message.toLowerCase().includes("deja")) {
          setStatus("already-submitted");
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError(error.message || "Echec de la soumission. Veuillez verifier l'URL de votre repository.");
      }

      setStatus("idle");
    }
  };

  // Afficher un loader pendant la vérification
  if (status === "loading") {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-3 text-sm font-mono text-gray-500">Verification de vos soumissions...</span>
      </div>
    );
  }

  // AFFICHAGE SI DÉJÀ SOUMIS
  if (status === "already-submitted" && existingSubmission) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 animate-in fade-in zoom-in duration-300">
        <div className="flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-md flex-shrink-0">
            <CheckCircle2 className="text-blue-600" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-mono text-sm font-bold text-blue-900 mb-1">
              Challenge deja soumis
            </h4>
            <p className="text-xs font-mono text-blue-700 mb-4">
              Votre solution est en cours d&apos;analyse par notre IA.
            </p>

            <div className="bg-white rounded-lg p-4 border border-blue-100 space-y-2">
              <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase">Repository</p>
                <a
                  href={existingSubmission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono text-blue-600 hover:underline break-all flex items-center gap-1"
                >
                  {existingSubmission.githubUrl}
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-mono text-gray-500 uppercase">Statut</p>
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-mono rounded-md mt-1">
                    {existingSubmission.status === "SUBMITTED" ? "En cours d'analyse" : existingSubmission.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-gray-500 uppercase">Soumis le</p>
                  <p className="text-xs font-mono text-gray-700 mt-1">
                    {existingSubmission.submittedAt 
                      ? new Date(existingSubmission.submittedAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Non disponible"
                    }
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-blue-600 mt-4">
              Vous recevrez une notification des que l&apos;analyse sera terminee.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // AFFICHAGE SI SUCCÈS (NOUVELLE SOUMISSION)
  if (status === "success") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-md mb-3">
          <CheckCircle2 className="text-emerald-600" size={24} />
        </div>
        <h4 className="font-mono text-sm font-bold text-emerald-900">Soumission reussie !</h4>
        <p className="text-xs font-mono text-emerald-700 mt-1">Votre projet est en cours d&apos;analyse par notre IA.</p>

        <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-100">
          <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Repository soumis</p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-blue-600 hover:underline break-all flex items-center justify-center gap-1"
          >
            {githubUrl}
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  // AFFICHAGE DU FORMULAIRE (NON SOUMIS)
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 relative overflow-hidden group transition-all hover:border-blue-200 shadow-sm">
      <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Send size={80} />
      </div>

      <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-md animate-pulse" />
        Valider le challenge
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block font-mono text-[10px] text-gray-400 uppercase mb-1.5 ml-1">
            Repository URL <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <GithubIcon
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                urlError ? "text-red-300" : "text-gray-300"
              }`}
              size={14}
            />
            <input
              required
              type="url"
              value={githubUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://github.com/username/repository"
              className={`w-full bg-gray-50 border rounded-lg py-2.5 pl-9 pr-4 text-sm font-mono focus:outline-none focus:ring-2 transition-all ${
                urlError
                  ? "border-red-200 focus:ring-red-500/10 focus:border-red-400"
                  : "border-gray-100 focus:ring-blue-500/10 focus:border-blue-400"
              }`}
            />

            {githubUrl && !urlError && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" size={14} />
            )}
          </div>

          {urlError && (
            <p className="text-[10px] font-mono text-red-500 mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={10} />
              {urlError}
            </p>
          )}

          {!urlError && !githubUrl && (
            <p className="text-[10px] font-mono text-gray-400 mt-1 ml-1">
              Exemple : https://github.com/votre-username/nom-du-projet
            </p>
          )}
        </div>

        <div>
          <label className="block font-mono text-[10px] text-gray-400 uppercase mb-1.5 ml-1">
            Commentaires / Description
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-gray-300" size={14} />
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Details techniques, difficultes rencontrees..."
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-2.5 pl-9 pr-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 text-[10px] font-mono">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting" || !!urlError}
          className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-mono text-xs uppercase tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
        >
          {status === "submitting" ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyse...</span>
            </div>
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