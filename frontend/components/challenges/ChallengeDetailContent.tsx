import React from "react";
import { BookOpen, Target, CheckCircle2 } from "lucide-react";
import { Challenge } from "@/types/challenge.types";

interface ChallengeDetailContentProps {
  challenge: Challenge;
}

export default function ChallengeDetailContent({ challenge }: ChallengeDetailContentProps) {
  const objectives = [
    "Design scalable and maintainable system architecture",
    "Implement efficient algorithms with optimal complexity",
    "Write clean, testable, and well-documented code",
    "Handle edge cases and error scenarios gracefully",
  ];

  const requirements = [
    "Implement all specified features completely",
    "Achieve optimal performance (< 100ms response)",
    "Maintain > 90% test coverage",
    "Follow consistent code style and conventions",
  ];

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Overview */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <BookOpen size={16} className="text-gray-400" />
          <h2 className="font-mono text-sm font-bold text-gray-600 uppercase tracking-wider">
            Overview
          </h2>
        </div>
        
        <p className="text-gray-600 leading-relaxed">
          This challenge tests your ability to design and implement production-ready solutions 
          using {challenge.technologies?.slice(0, 3).join(', ')} and more.
        </p>
      </div>
      
      {/* Learning Objectives */}
      <div className="spec-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} className="text-gray-400" />
          <h3 className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
            Learning Objectives
          </h3>
        </div>
        
        <div className="space-y-3">
          {objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
              <span className="text-sm text-gray-600">{obj}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="spec-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={16} className="text-gray-400" />
          <h3 className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
            Requirements
          </h3>
        </div>
        
        <div className="space-y-3">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
              <span className="text-sm text-gray-600">{req}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
