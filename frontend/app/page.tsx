'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Code2, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers, 
  CheckCircle2 
} from 'lucide-react'

// --- Composants Internes ---

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="group p-8 border border-[var(--border)] hover:border-[var(--ink)] transition-colors duration-300">
    <div 
      className="w-12 h-12 flex items-center justify-center mb-8 bg-[var(--accent)] transition-transform duration-500 group-hover:rotate-[360deg]"
      style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="text-lg font-bold text-[var(--ink)] mb-4 uppercase tracking-wider">{title}</h3>
    <p className="text-[var(--muted)] leading-relaxed text-[14px]">{desc}</p>
  </div>
)

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex flex-col gap-4">
    <span className="text-[40px] font-extrabold text-[var(--border)] leading-none">{number}</span>
    <h4 className="text-lg font-bold text-[var(--ink)] uppercase tracking-tight">{title}</h4>
    <p className="text-[var(--muted)] text-[14px] leading-relaxed">{desc}</p>
  </div>
)

// --- Page Principale ---

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-['Outfit'] selection:bg-[var(--accent)] selection:text-white">
      
      {/* Styles Globaux & Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        :root {
          --accent: #0052FF;
          --ink:    #0D0D0D;
          --muted:  #888888;
          --border: #E5E5E5;
          --bg:     #FFFFFF;
        }

        .nav-cta {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          padding: 12px 28px;
          border: 1.5px solid var(--ink);
          color: var(--ink);
          background: transparent;
          transition: all 0.2s ease;
          text-align: center;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
        }

        .nav-cta:hover {
          background: var(--ink);
          color: white;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.6s ease out forwards; }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <div className="animate-fade-up flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--border)] mb-10">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]">
                AI-Powered Code Review
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-[var(--ink)] mb-8 leading-[0.95]">
              Review code. <br />
              <span className="text-[var(--accent)]">Automate</span> growth.
            </h1>
            
            <p className="max-w-2xl text-[var(--muted)] text-lg md:text-xl mb-12 leading-relaxed">
              La plateforme de revue de code nouvelle génération qui combine l'IA et les meilleures pratiques du web moderne pour transformer vos projets.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/register" className="nav-cta scale-110">
                Start for free
              </Link>
              <Link href="https://github.com" className="flex items-center gap-2 font-bold text-[14px] uppercase tracking-wider hover:text-[var(--accent)] transition-colors">
                <Cpu className="w-5 h-5" />
                View on GitHub
              </Link>
            </div>
          </div>

          {/* Mockup / Dashboard Preview */}
          <div className="mt-24 relative max-w-6xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-[var(--ink)] rounded-t-lg p-2 flex items-center gap-2 border-x border-t border-[var(--ink)]">
              <div className="flex gap-1.5 ml-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
              </div>
              <div className="mx-auto text-[10px] text-white/30 font-medium uppercase tracking-[0.3em]">DevReview.AI — Dashboard</div>
            </div>
            <div className="aspect-[16/9] bg-gray-50 border-2 border-[var(--ink)] shadow-[30px_30px_0px_0px_rgba(0,82,255,0.05)] flex items-center justify-center group overflow-hidden">
                <div className="grid grid-cols-12 w-full h-full">
                    <div className="col-span-3 border-r border-[var(--border)] p-6 space-y-4">
                        {[1,2,3,4].map(i => <div key={i} className="h-2 bg-gray-200 w-full" />)}
                    </div>
                    <div className="col-span-9 p-10">
                        <div className="w-full h-full border-2 border-dashed border-gray-200 flex items-center justify-center">
                             <p className="text-[12px] font-bold text-gray-300 uppercase tracking-widest transition-all group-hover:tracking-[0.5em]">System Interface Preview</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--ink)] uppercase mb-6">
                Built for <br /> modern teams.
              </h2>
              <p className="text-[var(--muted)] leading-relaxed">
                Oubliez les processus manuels lents. Nous avons packagé les outils les plus puissants pour votre flux de travail quotidien.
              </p>
            </div>
            <Link href="/features" className="text-[13px] font-extrabold uppercase tracking-widest border-b-2 border-[var(--accent)] pb-1 mb-2">
              Explore all features
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <FeatureCard 
              icon={Zap} 
              title="Next-Gen Speed" 
              desc="Optimisé pour Next.js et React avec des temps de réponse sous les 100ms pour vos audits." 
            />
            <FeatureCard 
              icon={Cpu} 
              title="AI Analysis" 
              desc="Intégration profonde des LLMs pour suggérer des refactoring intelligents et sécurisés." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Enterprise Security" 
              desc="Audit automatique de vos schémas Prisma et détection des fuites de secrets." 
            />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Minimalist) --- */}
      <section className="py-32 bg-gray-50 border-y border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-4">Workflow</h2>
              <h3 className="text-2xl font-bold text-[var(--ink)]">Comment ça marche ?</h3>
            </div>
            <Step 
              number="01" 
              title="Connect" 
              desc="Liez votre dépôt GitHub ou GitLab en un clic via notre interface sécurisée." 
            />
            <Step 
              number="02" 
              title="Analyze" 
              desc="Notre moteur IA scanne votre architecture et vos composants en temps réel." 
            />
            <Step 
              number="03" 
              title="Deploy" 
              desc="Recevez des rapports détaillés et déployez avec une confiance totale." 
            />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="bg-[var(--ink)] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tighter">
                Ready to level up your code?
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/register" className="nav-cta !bg-white !text-[var(--ink)] !border-white hover:!bg-[var(--accent)] hover:!text-white hover:!border-[var(--accent)]">
                  Create Account
                </Link>
                <Link href="/contact" className="nav-cta !text-white !border-white/30 hover:!border-white">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6"
              style={{
                background: 'var(--accent)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              }}
            />
            <span className="font-bold text-[15px] uppercase tracking-widest">Logo</span>
          </div>
          
          <div className="flex gap-10">
            <Link href="#" className="text-[12px] font-bold uppercase text-[var(--muted)] hover:text-[var(--ink)]">Terms</Link>
            <Link href="#" className="text-[12px] font-bold uppercase text-[var(--muted)] hover:text-[var(--ink)]">Privacy</Link>
            <Link href="#" className="text-[12px] font-bold uppercase text-[var(--muted)] hover:text-[var(--ink)]">Twitter</Link>
          </div>

          <p className="text-[12px] text-[var(--muted)] font-medium">
            © {new Date().getFullYear()} — Made in Madagascar.
          </p>
        </div>
      </footer>
    </div>
  )
}