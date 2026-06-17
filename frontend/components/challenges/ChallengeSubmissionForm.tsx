"use client";

import React, { useState, useEffect } from "react";
import { Send, MessageSquare, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { submissionsApi } from "@/lib/submissions";
import { GithubIcon } from "../icon";

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
  onSubmissionCreated?: (submissionId: number) => void;
}) {
  const [status, setStatus] = useState<"loading" | "idle" | "submitting" | "success" | "already-submitted">("loading");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<ExistingSubmission | null>(null);

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

  const handleUrlChange = (value: string): void => {
    setGithubUrl(value);

    if (value.trim() === "") {
      setUrlError(null);
      return;
    }

    const validation = validateGithubUrl(value);
    setUrlError(validation.error || null);
  };

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
        setError("Repository GitHub introuvable. Vérifiez que le repository existe et est public.");
      } else if (error.response?.status === 403) {
        setError("Accès refusé. Assurez-vous que le repository est public.");
      } else if (error.response?.data?.message) {
        if (error.response.data.message.toLowerCase().includes("deja")) {
          setStatus("already-submitted");
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError(error.message || "Échec de la soumission. Veuillez vérifier l'URL de votre repository.");
      }

      setStatus("idle");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-[var(--blue)] animate-spin" />
        <span className="ml-3 text-sm font-bold text-[var(--gray)]">Vérification de vos soumissions...</span>
      </div>
    );
  }

  if (status === "already-submitted" && existingSubmission) {
    return (
      <div className="bg-[var(--blue)]/5 border border-[var(--blue)]/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[var(--blue)]/10 rounded-xl flex-shrink-0">
            <CheckCircle2 className="text-[var(--blue)]" size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[var(--navy)] mb-1">
              Challenge déjà soumis
            </h4>
            <p className="text-xs text-[var(--gray)] mb-4">
              Votre solution est en cours d&apos;analyse par notre IA.
            </p>

            <div className="bg-white rounded-lg p-4 border border-[var(--border-pink)] space-y-2">
              <div>
                <p className="text-[10px] font-bold text-[var(--gray)] uppercase">Repository</p>
                <a
                  href={existingSubmission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-[var(--blue)] hover:underline break-all flex items-center gap-1"
                >
                  {existingSubmission.githubUrl}
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-pink)]">
                <div>
                  <p className="text-[10px] font-bold text-[var(--gray)] uppercase">Statut</p>
                  <span className="inline-block px-2 py-1 bg-[var(--yellow)]/10 text-[var(--yellow)] text-[10px] font-bold rounded-full mt-1">
                    {existingSubmission.status === "SUBMITTED" ? "En cours d'analyse" : existingSubmission.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--gray)] uppercase">Soumis le</p>
                  <p className="text-xs font-bold text-[var(--navy)] mt-1">
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

            <p className="text-[10px] font-bold text-[var(--blue)] mt-4">
              Vous recevrez une notification dès que l&apos;analyse sera terminée.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
          <CheckCircle2 className="text-green-600" size={24} />
        </div>
        <h4 className="text-sm font-bold text-green-900">Soumission réussie !</h4>
        <p className="text-xs font-bold text-green-700 mt-1">Votre projet est en cours d&apos;analyse par notre IA.</p>

        <div className="mt-4 p-3 bg-white rounded-lg border border-green-100">
          <p className="text-[10px] font-bold text-[var(--gray)] uppercase mb-1">Repository soumis</p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[var(--blue)] hover:underline break-all flex items-center justify-center gap-1"
          >
            {githubUrl}
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 bg-[var(--blue)] rounded-full animate-pulse" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--gray)]">
          Valider le challenge
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-[var(--gray)] uppercase mb-1.5 ml-1">
            Repository URL <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <GithubIcon
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                urlError ? "text-red-300" : "text-[var(--gray)]"
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
              className={`w-full bg-[var(--cream)] border rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                urlError
                  ? "border-red-200 focus:ring-red-500/10 focus:border-red-400"
                  : "border-[var(--border-pink)] focus:ring-[var(--blue)]/10 focus:border-[var(--blue)]"
              }`}
            />

            {githubUrl && !urlError && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={14} />
            )}
          </div>

          {urlError && (
            <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={10} />
              {urlError}
            </p>
          )}

          {!urlError && !githubUrl && (
            <p className="text-[10px] font-bold text-[var(--gray)] mt-1 ml-1">
              Exemple : https://github.com/votre-username/nom-du-projet
            </p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[var(--gray)] uppercase mb-1.5 ml-1">
            Commentaires / Description
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-[var(--gray)]" size={14} />
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Détails techniques, difficultés rencontrées..."
              className="w-full bg-[var(--cream)] border border-[var(--border-pink)] rounded-xl py-2.5 pl-9 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--blue)]/10 focus:border-[var(--blue)] transition-all resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-200 text-[10px] font-bold">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting" || !!urlError}
          className="w-full bg-[var(--navy)] hover:bg-[#2A3050] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--navy)]/10 active:scale-95"
        >
          {status === "submitting" ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyse...</span>
            </div>
          ) : (
            <>
              Soumettre le projet
              <Send size={12} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
