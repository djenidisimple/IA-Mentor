"use client";

import { socialApi } from "@/lib/social";
import { Comment } from "@/types/social.types";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Clock,
  ChevronRight,
  Send,
  AlertCircle,
} from "lucide-react";
import RepositoryViewer from "@/components/challenges/RepositoryViewer";

export default function InfoCommunityPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const { slug } = use(params);
  const submissionId = Number(slug[0]);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await socialApi.getCommentsForSubmission(submissionId);
        // Accepte un tableau ou un objet unique selon l'API
        setComments(Array.isArray(response) ? response : [response]);
      } catch (err: any) {
        setError(err.message || "Impossible de charger les commentaires.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [submissionId]);

  const formatDate = (dateStr: string) => {
    const hours = Math.floor(
      (new Date().getTime() - new Date(dateStr).getTime()) / 3600000
    );
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  /* ── État de chargement ── */
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center ">
        <div className="w-8 h-8 border-2 border-[var(--border-pink)] border-t-[var(--blue)] animate-spin mb-4" />
        <p className="text-[13px] font-medium uppercase tracking-widest text-[var(--gray)]">
          Chargement des commentaires
        </p>
      </div>
    );
  }

  /* ── État d'erreur ── */
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center  gap-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-[13px] font-medium uppercase tracking-widest text-[var(--gray)]">
          {error}
        </p>
        <Link
          href="/community"
          className="text-[11px] font-bold uppercase tracking-widest text-[var(--blue)] border-b border-[var(--blue)] pb-0.5"
        >
          Retour à la communauté
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white ">

      {/* ── En-tête ── */}
      <header className="border-b border-[var(--border-pink)]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">

          {/* Fil d'Ariane */}
          <nav className="flex items-center gap-2 mb-8 text-[11px] font-bold uppercase tracking-widest">
            <Link
              href="/community"
              className="text-[var(--gray)] hover:text-[var(--blue)] transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Communauté
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--gray)]" />
            <span className="text-[var(--navy)]">Publication #{submissionId}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[var(--blue)] rotate-45" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--blue)]">
                  Fil de discussion
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--navy)]">
                Commentaires{" "}
                <span className="text-[var(--gray)]">/</span>{" "}
                <span className="text-[var(--gray)] text-3xl">#{submissionId}</span>
              </h1>
            </div>

            
            {/* Compteur */}
            <div className="flex items-center gap-2 pb-1">
              <MessageCircle className="w-4 h-4 text-[var(--gray)]" />
              <span className="text-[13px] font-bold text-[var(--gray)] uppercase tracking-widest">
                {comments.length} réponse{comments.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <RepositoryViewer submissionId={submissionId} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-10">
          {/* ── Liste des commentaires ── */}
          <div className="lg:col-span-2 space-y-12">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <article
                  key={comment.id ?? index}
                  className="group border-b border-[var(--border-pink)] pb-12 last:border-0"
                >
                  {/* Auteur + date */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          w-10 h-10
                          bg-[var(--cream)] border border-[var(--border-pink)]
                          flex items-center justify-center
                          font-bold text-[13px] text-[var(--navy)]
                          rounded-full overflow-hidden
                        "
                      >
                        {comment.user.avatar ? (
                          <img
                            src={comment.user.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          comment.user.username[0]?.toUpperCase() ?? "?"
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[15px] text-[var(--navy)]">
                            @{comment.user?.username ?? "anonyme"}
                          </span>
                        </div>
                        {comment.createdAt && (
                          <span className="text-[11px] font-medium text-[var(--gray)] uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {formatDate(comment.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Numéro de position */}
                    <span className="text-[11px] font-bold text-[var(--gray)] tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Contenu */}
                  <p className="text-[16px] leading-relaxed text-[var(--gray)] mb-6 max-w-2xl">
                    {comment.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[var(--gray)] hover:text-[var(--navy)] transition-colors">
                      <Heart className="w-4 h-4" />
                      {comment.likesCount ?? 0}
                    </button>
                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === (comment.id ?? index)
                            ? null
                            : (comment.id ?? index)
                        )
                      }
                      className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[var(--gray)] hover:text-[var(--navy)] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Répondre
                    </button>
                  </div>

                  {/* Zone de réponse inline */}
                  {replyingTo === (comment.id ?? index) && (
                    <div className="mt-6 flex gap-3 items-center">
                      <input
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Écrire une réponse..."
                        className="flex-1 border-b border-[var(--border-pink)] py-2 text-sm focus:outline-none focus:border-[var(--blue)] transition-colors bg-transparent"
                      />
                      <button
                        onClick={() => {
                          if (!newReply.trim()) return;
                          // TODO: appel API reply
                          setNewReply("");
                          setReplyingTo(null);
                        }}
                        className="text-[var(--blue)] hover:text-[var(--navy)] transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="text-center py-20 border border-dashed border-[var(--border-pink)]">
                <MessageCircle className="w-6 h-6 text-[var(--gray)] mx-auto mb-3" />
                <p className="text-[var(--gray)] text-sm">
                  Aucun commentaire pour l'instant.
                </p>
                <p className="text-[11px] text-[var(--gray)] uppercase tracking-widest mt-1">
                  Soyez le premier à réagir
                </p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-16">

            {/* Stats de la discussion */}
            <section>
              <div className="flex items-center gap-2 mb-8">
                <MessageCircle className="w-4 h-4 text-[var(--blue)]" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-[var(--navy)]">
                  Résumé
                </h3>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Commentaires", value: comments.length },
                  {
                    label: "Total likes",
                    value: comments.reduce(
                      (acc, c) => acc + (c.likesCount ?? 0),
                      0
                    ),
                  },
                  {
                    label: "Participants",
                    value: new Set(comments.map((c) => c.user?.username)).size,
                  },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-baseline border-b border-[var(--border-pink)] pb-4">
                    <p className="text-[11px] font-bold text-[var(--gray)] uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <span className="text-[22px] font-black text-[var(--navy)] tabular-nums">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA retour */}
            <section className="p-8 bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl">
              <span className="w-3 h-3 bg-[var(--blue)] rounded-full block mb-4" />
              <h3 className="text-lg font-bold text-[var(--navy)] mb-2">Explorer plus</h3>
              <p className="text-sm text-[var(--gray)] mb-6 leading-relaxed">
                Retrouvez toutes les soumissions et discussions de la communauté.
              </p>
              <Link
                href="/community"
                className="flex items-center justify-center w-full py-3 bg-[var(--navy)] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#2A3050] transition-all shadow-lg shadow-[var(--navy)]/10"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                Retour au fil
              </Link>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}