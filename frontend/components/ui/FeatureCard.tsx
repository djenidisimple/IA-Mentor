import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="group bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-[var(--navy)]/5 flex items-center justify-center text-[var(--navy)] mb-4 group-hover:bg-[var(--navy)] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--navy)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--gray)] leading-relaxed">{description}</p>
    </div>
  );
};
