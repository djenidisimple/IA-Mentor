'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Menu, X, ChevronRight, GitBranch, Code, Shield, Zap, Cpu, Lock, CheckCircle } from 'lucide-react';

export default function DevReviewLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [hoveredChallenge, setHoveredChallenge] = React.useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Simule l'état de connexion pour la démo

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2] overflow-x-hidden">
      {/* === HEADER === */}
      <nav className="fixed top-0 w-full z-50 bg-[#1A1919] outline outline-1 outline-[#D64933]/30 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/mobius.svg" alt="logo" className='w-16 h-16' />
            <div className="text-3xl font-black tracking-[-3px] text-[#F2E9E2]">
              DEV<span className="text-[#D64933]">REVIEW</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-mono tracking-wider">
            <a href="#challenges" className="hover:text-[#D64933] transition-colors duration-300">
              CHALLENGES
            </a>
            <a href="#how" className="hover:text-[#D64933] transition-colors duration-300">
              ANALYSE IA
            </a>
            {isLoggedIn && (
              <a href="#submit" className="hover:text-[#D64933] transition-colors duration-300">
                MES CHALLENGES
              </a>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-[#F2E9E2] hover:text-[#D64933] font-mono tracking-wider rounded-none"
                >
                  Connexion
                </Button>
                <Button 
                  className="bg-[#D64933] hover:bg-[#B33A22] text-[#F2E9E2] px-8 py-6 font-mono font-bold tracking-wider rounded-none transition-all duration-300 hover:skew-x-[-2deg]"
                >
                  S'INSCRIRE
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-[#E8C547] font-mono">Thomas M.</div>
                  <div className="text-[10px] text-[#666] font-mono">3 challenges en cours</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#D64933]/20 border border-[#D64933] flex items-center justify-center">
                  <span className="text-[#D64933] font-mono font-bold">TM</span>
                </div>
              </div>
            )}
          </div>

          <button 
            className="md:hidden text-[#F2E9E2] p-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1A1919] border-t border-[#D64933]/30 px-6 py-8 text-lg space-y-6 font-mono">
            <a href="#challenges" className="block hover:text-[#D64933]" onClick={() => setIsMobileMenuOpen(false)}>
              CHALLENGES
            </a>
            <a href="#how" className="block hover:text-[#D64933]" onClick={() => setIsMobileMenuOpen(false)}>
              ANALYSE IA
            </a>
            {!isLoggedIn ? (
              <>
                <a href="#" className="block hover:text-[#D64933]" onClick={() => setIsMobileMenuOpen(false)}>
                  Connexion
                </a>
                <Button className="w-full bg-[#D64933] hover:bg-[#B33A22] text-[#1A1919] py-6 font-mono font-bold rounded-none mt-4">
                  S'INSCRIRE
                </Button>
              </>
            ) : (
              <Button className="w-full bg-[#D64933] hover:bg-[#B33A22] text-[#1A1919] py-6 font-mono font-bold rounded-none mt-4">
                MON TABLEAU DE BORD
              </Button>
            )}
          </div>
        )}
      </nav>

      {/* === HERO — corrigé avec un message qui respecte le flow === */}
      <section className="pt-28 lg:pt-36 pb-20 bg-[#1A1919]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 -ml-2">
            <div className="inline-flex border-l-4 border-[#D64933] pl-4 py-2 text-[#E8C547] text-sm font-mono font-bold tracking-[2px]">
              CODE FRACTURÉ • RÉPARÉ PAR IA
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-8 pt-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-[-4px] text-[#F2E9E2]">
                TON CODE
                <br />
                SE CASSE.
                <br />
                <span className="text-[#D64933]">ON LE RÉPARE.</span>
              </h1>

              <p className="text-xl text-[#B8B0A0] leading-relaxed font-mono max-w-md">
                Choisis un challenge, soumets ton repo GitHub.
                <br />
                L'IA analyse ton code sans filtre.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-[#D64933] hover:bg-[#B33A22] text-[#F2E9E2] py-7 px-8 text-lg font-mono font-bold tracking-wider rounded-none group transition-all duration-300 hover:skew-x-[-2deg]"
                  onClick={() => document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  EXPLORER LES CHALLENGES
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-[#D64933] hover:bg-[#D64933]/10 text-[#B33A22] hover:text-[#F2E9E2] py-7 px-8 text-lg font-mono rounded-none"
                >
                  COMMENT ÇA MARCHE ?
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 relative">
              <div className="relative bg-[#0A0A0A] border border-[#D64933]/40 rounded-none overflow-hidden shadow-2xl transform rotate-[-0.5deg] hover:rotate-0 transition-transform duration-500">
                <div className="h-10 bg-[#121212] flex items-center px-3 gap-2 border-b border-[#D64933]/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] opacity-80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[#666] text-[11px] font-mono tracking-wider">terminal — fracture detected</span>
                  </div>
                  <div className="text-[#00E5D8] text-[11px] font-mono font-bold tracking-wider animate-pulse">
                    SCAN IA
                  </div>
                </div>

                <div className="p-6 font-mono text-sm leading-relaxed bg-[#0A0A0A]">
                  <div className="text-[#6B8C6B] mb-3">$ ./devreview analyze repo</div>
                  <div className="space-y-2.5">
                    <div className="text-[#C0C0C0] pl-4 border-l-2 border-[#D64933]/40">
                      user.setPassword(dto.getPassword());
                    </div>
                    <div className="text-[#FF6B6B] font-mono text-[13px] animate-pulse">
                      // FRACTURE DETECTED — Security vulnerability
                    </div>
                    <div className="text-[#4ECDC4]">
                      // RÉPARATION EN COURS...
                    </div>
                    <div className="text-[#95E77E] pl-4 border-l-2 border-[#4ECDC4]">
                      → Utiliser BCrypt ou Argon2 pour hasher le mot de passe
                    </div>
                    <div className="text-[#666] mt-5 pt-3 border-t border-[#D64933]/20">
                      Analysis completed in 1.8s • 3 critical issues found
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-right text-xs font-mono text-[#D64933]/60 tracking-widest">
                TERMINAL LINUX — CODE BRUT EXPOSÉ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION CHALLENGES — ici chaque carte mène à une page de détail avec soumission === */}
      <section id="challenges" className="py-24 bg-[#0F0E0E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-[-2px] text-[#F2E9E2]">
              CHALLENGES
              <br />
              <span className="text-[#D64933] text-2xl font-mono tracking-wider">/ choisis ton combat</span>
            </h2>
            <div className="w-24 h-[2px] bg-[#D64933] mt-6"></div>
            <p className="text-[#B8B0A0] font-mono text-sm mt-4 max-w-2xl">
              Chaque challenge est un projet concret. Tu le développes, tu soumets ton repo GitHub,
              l'IA analyse et te rend un rapport détaillé.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {[
              {
                id: 1,
                lang: "PHP • Laravel",
                title: "API REST sécurisée",
                desc: "Authentification JWT, rate limiting, validation avancée. L'IA vérifiera les failles OWASP.",
                difficulty: "intermédiaire",
                duration: "3-5h",
                icon: Shield,
                color: "#D64933"
              },
              {
                id: 2,
                lang: "Java • Spring Boot",
                title: "Architecture hexagonale",
                desc: "Clean architecture, tests unitaires, injection de dépendances. L'IA analyse le couplage et la maintenabilité.",
                difficulty: "avancé",
                duration: "5-8h",
                icon: Code,
                color: "#E8C547"
              },
              {
                id: 3,
                lang: "C# • .NET 8",
                title: "Performance & async",
                desc: "Pattern Repository, caching, async/await. L'IA détecte les deadlocks et les fuites mémoire.",
                difficulty: "avancé",
                duration: "4-6h",
                icon: Zap,
                color: "#4ECDC4"
              }
            ].map((challenge, idx) => (
              <div
                key={idx}
                className="group relative bg-[#1A1919] border-l-4 border-[#D64933] p-8 hover:translate-x-2 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredChallenge(idx)}
                onMouseLeave={() => setHoveredChallenge(null)}
                style={{
                  transform: hoveredChallenge === idx ? 'translateX(8px)' : 'translateX(0)',
                }}
              >
                <challenge.icon className="h-10 w-10 mb-6" style={{ color: challenge.color }} />
                <div className="text-xs font-mono text-[#D64933] tracking-wider mb-3">{challenge.lang}</div>
                <h3 className="text-2xl font-bold mb-3 text-[#F2E9E2]">{challenge.title}</h3>
                <div className="flex gap-3 mb-4">
                  <span className="text-[10px] font-mono text-[#E8C547] border border-[#E8C547]/30 px-2 py-0.5">
                    {challenge.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-[#666]">
                    {challenge.duration}
                  </span>
                </div>
                <p className="text-[#B8B0A0] font-mono text-sm leading-relaxed mb-6">{challenge.desc}</p>
                
                {/* Le CTA change selon l'état de connexion */}
                {!isLoggedIn ? (
                  <Button className="w-full bg-transparent border border-[#D64933] hover:bg-[#D64933] hover:text-[#1A1919] text-[#D64933] font-mono rounded-none transition-all">
                    S'INSCRIRE POUR COMMENCER
                  </Button>
                ) : (
                  <Button className="w-full bg-[#D64933] hover:bg-[#B33A22] text-[#1A1919] font-mono font-bold rounded-none group">
                    COMMENCER LE CHALLENGE
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SECTION FLOW — explique le processus en 3 étapes === */}
      <section className="py-24 bg-[#1A1919]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#D64933]/10 mb-6">
              <span className="text-[#D64933] font-mono text-sm tracking-wider">/ COMMENT ÇA MARCHE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-[-2px] text-[#F2E9E2]">
              Trois étapes.<br />
              <span className="text-[#E8C547]">Zéro bullshit.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="relative bg-[#0F0E0E] p-8 border-l-4 border-[#D64933]">
              <div className="text-5xl font-black text-[#D64933]/20 mb-4">01</div>
              <h3 className="text-2xl font-bold mb-3">Crée ton compte</h3>
              <p className="text-[#B8B0A0] font-mono text-sm">Inscription en 30 secondes. Pas de carte bleue pour commencer.</p>
            </div>
            <div className="relative bg-[#0F0E0E] p-8 border-l-4 border-[#D64933]">
              <div className="text-5xl font-black text-[#D64933]/20 mb-4">02</div>
              <h3 className="text-2xl font-bold mb-3">Choisis un challenge</h3>
              <p className="text-[#B8B0A0] font-mono text-sm">PHP, Java, C#, Rust, Go... Chaque stack a ses propres défis.</p>
            </div>
            <div className="relative bg-[#0F0E0E] p-8 border-l-4 border-[#D64933]">
              <div className="text-5xl font-black text-[#D64933]/20 mb-4">03</div>
              <h3 className="text-2xl font-bold mb-3">Soumets ton repo</h3>
              <p className="text-[#B8B0A0] font-mono text-sm">L'IA analyse ton code. Tu reçois un rapport détaillé en 1-3 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION ANALYSE IA — inchangée mais repositionnée === */}
      <section id="how" className="py-24 bg-[#0F0E0E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-[#D64933]/10 px-4 py-2 mb-8">
                <Cpu className="h-4 w-4 text-[#D64933]" />
                <span className="text-xs font-mono text-[#D64933] tracking-wider">IA ENGINE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-[-2px] text-[#F2E9E2] mb-6">
                L'IA ne fait pas<br />
                <span className="text-[#E8C547]">dans la dentelle.</span>
              </h2>
              <p className="text-lg text-[#B8B0A0] font-mono leading-relaxed mb-8">
                Analyse statique, détection de patterns, suggestions d'optimisation.
                Pas de feedback poli. Juste ce qui cloche.
              </p>
              <ul className="space-y-4">
                {[
                  "🔴 Vulnérabilités de sécurité",
                  "🟡 Code smell et dette technique",
                  "🟢 Performances et scaling"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[#F2E9E2] font-mono text-sm">
                    <div className="w-2 h-2 bg-[#D64933] rotate-45"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="bg-[#0A0A0A] p-6 border border-[#D64933]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D64933]/5 blur-3xl"></div>
                <pre className="font-mono text-xs text-[#6B8C6B] overflow-x-auto">
                  <code>
                    {`// Analyse en cours...
                      > Scanning repository...
                      > 127 files analyzed
                      > 14 vulnerabilities found

                      CRITICAL:
                      - SQL Injection dans UserController.php:45
                      - XSS dans commentaires: non échappé
                      - Clé API exposée dans .env.example

                      SUGGESTIONS:
                      → Utiliser prepared statements
                      → Ajouter CSP headers
                      → Déplacer .env.example hors du repo`}
                  </code>
                </pre>
                <div className="mt-4 pt-4 border-t border-[#D64933]/20">
                  <div className="text-[#E8C547] text-xs font-mono animate-pulse">
                    █ ANALYSE EN TEMPS RÉEL — 127 problèmes détectés ce mois-ci
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION CTA FINAL — pour les non-inscrits === */}
      <section className="py-24 bg-[#1A1919]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block px-6 py-3 border-2 border-[#D64933] mb-8">
            <span className="text-[#D64933] font-mono font-bold tracking-wider">./PRÊT_A_FRACTURER</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-2px] text-[#F2E9E2] mb-6">
            {!isLoggedIn ? (
              <>Crée ton compte.<br /><span className="text-[#E8C547]">C'est gratuit.</span></>
            ) : (
              <>Choisis un challenge.<br /><span className="text-[#E8C547]">On t'attend.</span></>
            )}
          </h2>
          
          {!isLoggedIn ? (
            <Button className="bg-[#D64933] hover:bg-[#B33A22] text-[#F2E9E2] px-12 py-8 text-xl font-mono font-bold rounded-none">
              S'INSCRIRE MAINTENANT
            </Button>
          ) : (
            <Button 
              className="bg-[#D64933] hover:bg-[#B33A22] text-[#F2E9E2] px-12 py-8 text-xl font-mono font-bold rounded-none"
              onClick={() => document.getElementById('challenges')?.scrollIntoView({ behavior: 'smooth' })}
            >
              VOIR LES CHALLENGES
            </Button>
          )}
          
          <p className="mt-6 text-xs text-[#666] font-mono">
            Pas de carte bleue. Tu soumets ton repo quand tu es prêt.
          </p>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="py-16 bg-[#0A0A0A] border-t border-[#D64933]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/mobius.svg" alt="logo" className='w-16 h-16' />
                <span className="text-2xl font-black tracking-[-2px] text-[#F2E9E2]">DEVREVIEW</span>
              </div>
              <p className="text-sm text-[#666] font-mono">
                Fracture ton code.<br />
                Reconstruis mieux.
              </p>
            </div>
            <div>
              <h4 className="text-[#D64933] font-mono text-sm tracking-wider mb-4">PLATEFORME</h4>
              <ul className="space-y-2 text-sm text-[#888] font-mono">
                <li><a href="#" className="hover:text-[#D64933]">Challenges</a></li>
                <li><a href="#" className="hover:text-[#D64933]">Analyse IA</a></li>
                <li><a href="#" className="hover:text-[#D64933]">Communauté</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#D64933] font-mono text-sm tracking-wider mb-4">RESSOURCES</h4>
              <ul className="space-y-2 text-sm text-[#888] font-mono">
                <li><a href="#" className="hover:text-[#D64933]">Documentation</a></li>
                <li><a href="#" className="hover:text-[#D64933]">Blog technique</a></li>
                <li><a href="#" className="hover:text-[#D64933]">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#D64933] font-mono text-sm tracking-wider mb-4">LÉGAL</h4>
              <ul className="space-y-2 text-sm text-[#888] font-mono">
                <li><a href="#" className="hover:text-[#D64933]">Conditions</a></li>
                <li><a href="#" className="hover:text-[#D64933]">Confidentialité</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#D64933]/10 text-center text-xs text-[#666] font-mono">
            DEVREVIEW — L'IA qui ne te dira pas que ton code est beau.
          </div>
        </div>
      </footer>
    </div>
  );
}
