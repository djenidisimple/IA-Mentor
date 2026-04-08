import React from "react";
import Link from "next/link";
import { ArrowLeft, FileCode, Calendar } from "lucide-react";
import { challengesApi } from "@/lib/challenges";
import { Challenge } from "@/types/challenge.types";

import ChallengeStyles from "@/components/challenges/ChallengeStyles";
import ChallengeDetailHeader from "@/components/challenges/ChallengeDetailHeader";
import ChallengeDetailContent from "@/components/challenges/ChallengeDetailContent";
import ChallengeDetailSidebar from "@/components/challenges/ChallengeDetailSidebar";

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  
  const challenge: Challenge | null = await challengesApi.getBySlug(slug).catch((): null => null);

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
          <p className="font-mono text-xs text-gray-400 mb-4">
            Challenge &quot;{slug}&quot; doesn&apos;t exist
          </p>
          <Link 
            href="/challenges"
            className="inline-flex items-center gap-2 font-mono text-sm text-gray-700 hover:text-gray-900 border border-gray-200 bg-white px-5 py-2.5 rounded-xl transition-all"
          >
            <ArrowLeft size={14} />
            Browse Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter'] relative">
      <ChallengeStyles />
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="blueprint-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative z-10">
        <ChallengeDetailHeader challenge={challenge} />
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChallengeDetailContent challenge={challenge} />
            <ChallengeDetailSidebar challenge={challenge} />
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-100 mt-12">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span>ID: {String(challenge.id).slice(0, 8).toUpperCase()}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="text-gray-300">|</span>
                <span>v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
