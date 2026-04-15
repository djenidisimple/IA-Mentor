import React from "react";
import Link from "next/link";
import { ArrowLeft, FileCode } from "lucide-react";
import { challengesApi } from "@/lib/challenges";
import { Challenge } from "@/types/challenge.types";

import ChallengeStyles from "@/components/challenges/ChallengeStyles";
import ChallengeStepLayout from "@/components/challenges/ChallengeStepLayout";

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  
  const challenge: Challenge | null = await challengesApi.getBySlug(slug).catch((e) => {
    return null;
  });

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] flex items-center justify-center">
        <ChallengeStyles />
        <div className="blueprint-grid fixed inset-0 opacity-30 pointer-events-none" />
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white border border-gray-100 rounded-xl mb-4">
            <FileCode size={32} className="text-gray-300" />
          </div>
          <p className="font-mono text-lg text-gray-500 mb-2">Not Found</p>
          <p className="font-mono text-xs text-gray-400 mb-4 italic">
            Challenge &quot;{slug}&quot; doesn&apos;t exist
          </p>
          <Link 
            href="/challenges"
            className="inline-flex items-center gap-2 font-mono text-sm text-gray-700 hover:text-gray-900 border border-gray-200 bg-white px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft size={14} />
            Browse Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChallengeStyles />
      <ChallengeStepLayout challenge={challenge} />
    </>
  );
}