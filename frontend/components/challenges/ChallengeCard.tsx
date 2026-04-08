import React from "react";
import Link from "next/link";
import { ArrowRight, Crown, Clock } from "lucide-react";
import { Challenge } from "@/types/challenge.types";
import { DIFFICULTY_SPECS, DEFAULT_DIFFICULTY_SPEC, MODULE_CONFIG, DEFAULT_MODULE_CONFIG } from "@/lib/challenge-constants";
import ChallengeBadge from "./ChallengeBadge";

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
}

export default function ChallengeCard({ challenge, index }: ChallengeCardProps) {
  const difficulty = DIFFICULTY_SPECS[challenge.level] ?? DEFAULT_DIFFICULTY_SPEC;
  const moduleConfig = MODULE_CONFIG[challenge.type] ?? DEFAULT_MODULE_CONFIG;
  
  const ModuleIcon = moduleConfig.icon;

  return (
    <Link
      href={`/challenges/${challenge.slug}`}
      className="group relative block"
      style={{ animation: `slideUp 400ms ease ${Math.min(index * 30, 240)}ms both` }}
    >
      <div 
        className="relative overflow-hidden rounded-2xl transition-all duration-300 h-full flex flex-col"
        style={{
          background: `linear-gradient(135deg, ${moduleConfig.bgColor} 0%, #FFFFFF 100%)`,
          border: `1.5px solid ${moduleConfig.borderColor}`
        }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${moduleConfig.color} 0px, ${moduleConfig.color} 1px, transparent 1px, transparent 10px)`
          }} />
        </div>

        <div className="relative p-5 md:p-6 flex-1 flex flex-col">
          {/* Top Row - Type & Difficulty */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: `${moduleConfig.color}15`,
                  color: moduleConfig.color 
                }}
              >
                <ModuleIcon size={18} className="md:w-5 md:h-5" />
              </div>
              <div>
                <span 
                  className="font-mono text-[9px] md:text-[10px] font-black tracking-wider uppercase"
                  style={{ color: moduleConfig.color }}
                >
                  {moduleConfig.label}
                </span>
                <div className="font-mono text-[8px] text-gray-400">
                  #{String(challenge.id || index).slice(0, 6)}
                </div>
              </div>
            </div>

            <ChallengeBadge 
              type="DIFFICULTY" 
              value={challenge.level} 
            />
          </div>

          {/* Title & Description */}
          <h3 className="font-['Syne'] text-lg md:text-xl font-bold tracking-tight text-gray-900 mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
            {challenge.title}
          </h3>
          
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
            {challenge.description}
          </p>

          {/* Tech Stack - Minimalist */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {challenge.technologies?.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="font-mono text-[9px] md:text-[10px] text-gray-500 px-0"
              >
                {tech}{i < Math.min(2, (challenge.technologies?.length || 0) - 1) && ','}
              </span>
            ))}
            {(challenge.technologies?.length || 0) > 3 && (
              <span 
                className="font-mono text-[9px] md:text-[10px] font-bold"
                style={{ color: moduleConfig.color }}
              >
                +{(challenge.technologies?.length || 0) - 3}
              </span>
            )}
          </div>

          {/* Footer - Points & Action */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Crown size={14} className="md:w-4 md:h-4" style={{ color: moduleConfig.color }} />
                <span className="font-mono text-sm md:text-base font-black text-gray-900">
                  {challenge.points}
                </span>
                <span className="font-mono text-[8px] md:text-[9px] text-gray-400">XP</span>
              </div>
              
              <div className="flex items-center gap-1 text-gray-400">
                <Clock size={12} className="md:w-3.5 md:h-3.5" />
                <span className="font-mono text-[9px] md:text-[10px]">
                  {challenge.level === 'EASY' || challenge.level === 'DEBUTANT' ? '30m' : 
                   challenge.level === 'MEDIUM' || challenge.level === 'INTERMEDIAIRE' ? '60m' : '90m'}
                </span>
              </div>
            </div>

            <div 
              className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2"
              style={{ 
                backgroundColor: moduleConfig.color,
                color: 'white'
              }}
            >
              <ArrowRight size={14} className="md:w-4 md:h-4" />
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          style={{ background: `linear-gradient(to right, ${moduleConfig.color}, ${difficulty.color})` }}
        />
      </div>
    </Link>
  );
}
