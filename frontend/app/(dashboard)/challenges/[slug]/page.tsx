import React from "react";
import Link from "next/link";
import { ArrowLeft, FileCode, SearchX, Terminal } from "lucide-react";
import { challengesApi } from "@/lib/challenges";
import { Challenge } from "@/types/challenge.types";

import ChallengeStepLayout from "@/components/challenges/ChallengeStepLayout";

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps): Promise<React.ReactElement> {
  const { slug } = await params;

  const challenge: Challenge | null = await challengesApi.getBySlug(slug).catch(() => {
    return null;
  });

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-[var(--border-pink)] rounded-2xl p-10 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--cream)] rounded-bl-2xl flex items-center justify-center">
            <SearchX size={32} className="text-[var(--border-pink)]" />
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--blue)]/5 border-2 border-[var(--blue)] rounded-xl mb-8">
            <Terminal size={32} className="text-[var(--blue)]" />
          </div>

          <h1 className="text-2xl font-extrabold text-[var(--navy)] mb-3">
            Challenge Introuvable
          </h1>

          <p className="text-[var(--gray)] text-sm mb-8 leading-relaxed">
            Le slug <span className="text-[var(--orange)] font-bold">&quot;{slug}&quot;</span> est invalide ou a été déplacé.
          </p>

          <Link
            href="/challenges"
            className="inline-flex items-center justify-center gap-3 bg-[var(--navy)] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-all hover:bg-[#2A3050] shadow-lg shadow-[var(--navy)]/10"
          >
            <ArrowLeft size={16} />
            Retour aux défis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <ChallengeStepLayout challenge={challenge} />
    </div>
  );
}
