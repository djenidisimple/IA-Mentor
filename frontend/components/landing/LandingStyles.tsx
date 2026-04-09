import React from "react";

export default function LandingStyles(): React.ReactElement {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700;800&display=swap');
      
      :root {
        --bg-main: #FBFBF9;
        --bg-card: #FFFFFF;
        --accent-emerald: #10B981;
        --accent-blue: #3B82F6;
        --accent-red: #EF4444;
        --accent-amber: #F59E0B;
        --accent-purple: #8B5CF6;
        --text-primary: #111827;
        --text-secondary: #4B5563;
        --border-color: #E2E8F0;
      }

      body {
        background-color: var(--bg-main);
        color: var(--text-primary);
        font-family: 'Inter', sans-serif;
      }

      .font-syne { font-family: 'Syne', sans-serif; }
      .font-grotesk { font-family: 'Space Grotesk', sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }

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

      .diagonal-pattern {
        background-image: repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 10px);
      }

      .glass-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        border: 1.5px solid var(--border-color);
      }

      .spec-card {
        transition: all 300ms ease;
        border: 1.5px solid var(--border-color);
        background: var(--bg-card);
      }
      
      .spec-card:hover {
        border-color: var(--accent-blue);
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .animate-slideUp {
        animation: slideUp 600ms ease forwards;
      }

      /* Multi-colored text utilities */
      .char-red { color: var(--accent-red); }
      .char-blue { color: var(--accent-blue); }
      .char-amber { color: var(--accent-amber); }
      .char-emerald { color: var(--accent-emerald); }
      .char-purple { color: var(--accent-purple); }

      * {
        scroll-behavior: smooth;
      }

      ::selection {
        background: rgba(59, 130, 246, 0.1);
        color: var(--accent-blue);
      }
    `}</style>
  );
}