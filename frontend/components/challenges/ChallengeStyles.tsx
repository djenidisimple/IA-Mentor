import React from "react";

const ChallengeStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    /* Animation de flottement plus sèche */
    @keyframes float-minimal {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }
    
    /* Apparition nette sans trop de flou */
    @keyframes fastIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Pulse pour les indicateurs d'état (comme le petit point bleu) */
    @keyframes status-pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }

    /* Le nouveau fond : Un grain très léger ou rien, pour rester pro */
    .geometric-bg {
      background-color: #FFFFFF;
      background-image: radial-gradient(#00000008 1px, transparent 1px);
      background-size: 24px 24px;
    }
    
    /* Remplacement du blueprint par un quadrillage ultra-fin noir */
    .grid-overlay {
      background-image: 
        linear-gradient(to right, #0D0D0D03 1px, transparent 1px),
        linear-gradient(to bottom, #0D0D0D03 1px, transparent 1px);
      background-size: 40px 40px;
    }

    /* Cartes de spécifications style Bento */
    .spec-card {
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid #F1F5F9;
      background: #FFFFFF;
    }
    
    .spec-card:hover {
      border-color: #0052FF;
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -15px rgba(0, 82, 255, 0.1);
    }

    /* Bouton d'action principal - État actif */
    .btn-primary-active:active {
      transform: scale(0.96);
    }

    /* Skeleton loading propre (Shimmer) */
    .animate-shimmer-fast {
      background: linear-gradient(
        90deg, 
        rgba(241, 245, 249, 0) 0%, 
        rgba(241, 245, 249, 1) 50%, 
        rgba(241, 245, 249, 0) 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.2s infinite linear;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* Utilities pour le texte Neo-Bento */
    .text-sharp {
      letter-spacing: -0.02em;
    }

    .tracking-ultra {
      letter-spacing: 0.15em;
    }
  `}</style>
);

export default ChallengeStyles;