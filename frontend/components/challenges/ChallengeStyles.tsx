import React from "react";

const ChallengeStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap');
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes pulse-subtle {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    .geometric-bg {
      background-image: 
        radial-gradient(circle at 20% 30%, #EF444408 1px, transparent 1px),
        radial-gradient(circle at 80% 70%, #3B82F608 1.5px, transparent 1.5px),
        radial-gradient(circle at 50% 50%, #F59E0B08 1px, transparent 1px);
      background-size: 40px 40px, 60px 60px, 50px 50px;
    }
    
    .grid-overlay {
      background-image: 
        linear-gradient(to right, #00000004 1px, transparent 1px),
        linear-gradient(to bottom, #00000004 1px, transparent 1px);
      background-size: 30px 30px;
    }

    .blueprint-grid {
      background-image: 
        linear-gradient(to right, #E2E8F0 1px, transparent 1px),
        linear-gradient(to bottom, #E2E8F0 1px, transparent 1px);
      background-size: 24px 24px;
    }
    
    .spec-card {
      transition: all 200ms ease;
      border: 1px solid #E2E8F0;
      background: #FFFFFF;
    }
    
    .spec-card:hover {
      border-color: #3B82F6;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.06);
    }

    .animate-shimmer {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  `}</style>
);

export default ChallengeStyles;
