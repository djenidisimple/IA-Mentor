import React from "react";
import Link from "next/link";
import { Package, Link2, ChevronRight, AlertCircle } from "lucide-react";
import { Challenge, ChallengeType } from "@/types/challenge.types";
import { MODULE_CONFIG, DEFAULT_MODULE_CONFIG } from "@/lib/challenge-constants";

interface ChallengeDetailSidebarProps {
  challenge: Challenge;
}

interface RelatedChallenge {
  title: string;
  type: ChallengeType;
  points: number;
}

export default function ChallengeDetailSidebar({ challenge }: ChallengeDetailSidebarProps) {
  const related: RelatedChallenge[] = [
    { title: "API Rate Limiter", type: "BACKEND", points: 350 },
    { title: "Caching Strategy", type: "BACKEND", points: 280 },
    { title: "Database Sharding", type: "FULLSTACK", points: 520 },
  ];

  return (
    <div className="space-y-6">
      {/* Tech Stack */}
      <div className="spec-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-gray-400" />
          <h3 className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
            Technologies
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {challenge.technologies?.map((tech, i) => (
            <span 
              key={i} 
              className="px-3 py-2 font-mono text-xs bg-gray-50 text-gray-700 rounded-lg border border-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Related Challenges */}
      <div className="spec-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Link2 size={16} className="text-gray-400" />
          <h3 className="font-mono text-xs font-bold text-gray-600 uppercase tracking-wider">
            Related
          </h3>
        </div>
        
        <div className="space-y-1">
          {related.map((item, i) => {
            const moduleConfig = MODULE_CONFIG[item.type] || DEFAULT_MODULE_CONFIG;
            return (
              <Link 
                href={`/challenges/${item.title.toLowerCase().replace(/\s+/g, '-')}`} 
                key={i} 
                className="block group p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="font-mono text-[9px] font-medium px-2 py-0.5 rounded"
                        style={{ 
                          color: moduleConfig.color, 
                          backgroundColor: `${moduleConfig.color}10` 
                        }}
                      >
                        {item.type}
                      </span>
                      <span className="font-mono text-[9px] text-gray-400">{item.points} XP</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Tip */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-mono text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
              Pro Tip
            </h4>
            <p className="text-xs text-blue-700">
              Break down the problem into smaller components and iterate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
