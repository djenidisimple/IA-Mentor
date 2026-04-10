"use client";

import React, { useEffect, useState } from "react";
import { 
  ArrowRight, 
  CheckCircle, 
  Code, 
  Sparkles,
  Zap,
  Trophy,
  Brain,
  ChevronRight,
  Menu,
  X,
  Play,
  Terminal,
  Cpu,
  BarChart3,
  ShieldCheck,
  Star,
  Layers,
  Activity,
  Maximize2,
  Lock,
  Target
} from "lucide-react";
import Link from "next/link";
import { AppIcon, GithubIcon } from "@/components/icon";

export default function LandingPage(): React.ReactElement {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-gray-900 relative overflow-x-hidden selection:bg-blue-500/10 selection:text-blue-600">


      <div className="relative z-10">
        {/* Navigation - Architectural Style */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "py-3 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm" : "py-6 bg-transparent"
        }`}>
          <div className="max-w-[1600px] mx-auto px-5 md:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white border-1.5 border-gray-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <AppIcon className="text-gray-900 w-6 h-6" />
              </div>
              <span className="font-syne text-xl font-bold tracking-tighter text-gray-900 uppercase">
                <span className="text-gray-900">dev</span><span className="text-blue-600">Review</span> <span className="text-amber-500">AI</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              <Link href="#features" className="font-mono text-[10px] font-bold tracking-widest text-gray-500 hover:text-gray-900 transition-colors uppercase">Challenges</Link>
              <Link href="#how-it-works" className="font-mono text-[10px] font-bold tracking-widest text-gray-500 hover:text-gray-900 transition-colors uppercase">Blueprint</Link>
              <Link href="#docs" className="font-mono text-[10px] font-bold tracking-widest text-gray-500 hover:text-gray-900 transition-colors uppercase">Docs</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button className="font-mono text-[10px] font-bold tracking-widest px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors uppercase">
                Sign In
              </button>
              <button className="px-6 py-2.5 bg-gray-900 text-white font-mono text-[10px] font-bold tracking-widest rounded-lg transition-all hover:bg-gray-800 active:scale-95 uppercase shadow-lg shadow-gray-200">
                Launch Project
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
              <Link href="#features" className="font-mono text-xs font-bold py-2 uppercase tracking-widest">Challenges</Link>
              <Link href="#how-it-works" className="font-mono text-xs font-bold py-2 uppercase tracking-widest">Blueprint</Link>
              <Link href="#docs" className="font-mono text-xs font-bold py-2 uppercase tracking-widest">Docs</Link>
              <div className="h-px bg-gray-100 my-2" />
              <button className="w-full py-4 bg-gray-900 text-white font-mono text-xs font-bold rounded-xl uppercase tracking-widest">
                Get Started
              </button>
            </div>
          )}
        </nav>

        {/* Hero Section - English */}
        <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-5 md:px-8 text-center">
            
            <h1 className="font-syne text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-10 leading-[0.85] text-gray-900 uppercase">
              <span className="block mb-2 text-gray-400">Master AI-Powered</span>
              <span className="block">
                M<span className="char-red">e</span>n<span className="char-blue">t</span>o<span className="char-amber">r</span><span className="char-emerald">i</span><span className="char-purple">p</span>
              </span>
            </h1>

            <p className="max-w-2xl mx-auto font-grotesk text-gray-500 text-lg md:text-xl mb-12 leading-relaxed">
              The technical laboratory where AI dissects your code branch by branch 
              to forge your expertise as a senior engineer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
              <button className="group px-8 py-4 bg-gray-900 text-white font-mono text-xs font-black tracking-widest rounded-xl flex items-center gap-3 transition-all hover:bg-gray-800 active:scale-95 shadow-xl shadow-gray-200 uppercase">
                Explore Catalog
                <Maximize2 size={16} className="group-hover:rotate-90 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-900 font-mono text-xs font-black tracking-widest rounded-xl flex items-center gap-3 transition-all border-1.5 border-gray-200 hover:border-gray-900 uppercase">
                <Play size={16} className="fill-blue-500 text-blue-500" />
                Specifications
              </button>
            </div>

            {/* Interactive Preview - Medium Rounded */}
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl -rotate-1 opacity-50" />
              <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 diagonal-pattern text-gray-100 opacity-[0.03] pointer-events-none" />
                
                {/* Window Header */}
                <div className="bg-gray-50/50 px-6 py-5 flex items-center justify-between border-b border-gray-100">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  </div>
                  <div className="font-mono text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-lg border border-gray-100">
                    ANALYSE_MODULE_PROMPT.TSX — SPEC_TYPE_V1
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Maximize2 size={14} />
                  </div>
                </div>
                
                {/* Code Window */}
                <div className="grid lg:grid-cols-5 min-h-[500px]">
                  {/* Sidebar */}
                  <div className="lg:col-span-1 border-r border-gray-100 p-6 text-left bg-gray-50/50">
                    <div className="font-mono text-[9px] font-black text-blue-600 mb-6 uppercase tracking-widest">
                      Structure
                    </div>
                    <div className="space-y-4 font-mono text-[10px] text-gray-400">
                      <div className="flex items-center gap-2 text-gray-900 font-bold">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        Component
                      </div>
                      <div className="ml-4 pl-4 border-l border-gray-200 space-y-3">
                        <div>Props</div>
                        <div>Hooks</div>
                        <div className="text-red-500 font-bold">Logic (!)</div>
                        <div>Render</div>
                      </div>
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="lg:col-span-2 p-8 text-left font-mono text-sm leading-relaxed overflow-x-auto bg-white">
                    <div className="flex gap-4 opacity-50 mb-3">
                      <span className="text-[10px]">01</span>
                      <span className="text-blue-600">const</span>
                      <span className="text-gray-900 font-bold">MentorEngine</span>
                      <span className="text-gray-400">= () =&gt; {"{"}</span>
                    </div>
                    <div className="flex gap-4 mb-3 relative group/line bg-red-400/5 -mx-4 px-4 py-0.5 border-l-2 border-red-500">
                      <span className="opacity-50 text-[10px]">02</span>
                      <span className="text-blue-600 ml-4">const</span>
                      <span className="text-gray-900">data =</span>
                      <span className="text-blue-600">await</span>
                      <span className="text-amber-600">API</span>
                      <span className="text-gray-400">.fetch();</span>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                         <div className="flex items-center gap-1.5 bg-red-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                            Error
                         </div>
                      </div>
                    </div>
                    <div className="flex gap-4 opacity-50 mb-3">
                      <span className="text-[10px]">03</span>
                      <span className="text-blue-600 ml-4">return</span>
                      <span className="text-gray-900">data;</span>
                    </div>
                    <div className="flex gap-4 opacity-50">
                      <span className="text-[10px]">04</span>
                      <span className="text-gray-400">{"}"}</span>
                    </div>
                  </div>
                  
                  {/* Review Panel */}
                  <div className="lg:col-span-2 bg-gray-50/70 p-8 text-left border-l border-gray-100">
                    <div className="flex items-start justify-between mb-10">
                      <div>
                        <h4 className="font-syne font-bold text-gray-900 text-lg uppercase">Technical Review</h4>
                        <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mt-1">Real-time audit</div>
                      </div>
                      <div className="bg-red-500 text-white rounded-lg p-3 shadow-xl shadow-red-100">
                        <Activity size={20} />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-5 bg-white rounded-xl border-1.5 border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">SECURITY</span>
                          <span className="font-mono text-[8px] text-gray-300">MOD_01</span>
                        </div>
                        <p className="font-grotesk text-xs text-gray-600 leading-relaxed">
                          The <span className="font-mono text-gray-900 font-bold bg-gray-100 px-1">fetchData</span> function is vulnerable. Missing 
                          <span className="text-red-600 font-bold"> try/catch </span> block may cause execution failure.
                        </p>
                      </div>
                      
                      <div className="p-5 bg-white rounded-xl border-1.5 border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">OPTIMIZATION</span>
                          <span className="font-mono text-[8px] text-gray-300">MOD_02</span>
                        </div>
                        <p className="font-grotesk text-xs text-gray-600 leading-relaxed">
                          Implement an <span className="font-mono text-gray-900 font-bold bg-gray-100 px-1">AbortController</span> to handle 
                          network timeouts. Expected performance: +12%.
                        </p>
                      </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-[10px] font-black text-gray-400">CURRENT SCORE</div>
                        <div className="font-mono text-xl font-black text-red-500 tracking-tighter">42/100</div>
                      </div>
                      <button className="font-mono text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-2">
                        Apply Fix <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - English */}
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="max-w-[1600px] mx-auto px-5 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                { val: "2.4k+", label: "CODE_REVIEWS", color: "text-red-500" },
                { val: "99.2%", label: "ACCURACY_RATE", color: "text-blue-500" },
                { val: "48ms", label: "ANALYSIS_LATENCY", color: "text-amber-500" },
                { val: "100%", label: "GDPR_COMPLIANT", color: "text-emerald-500" }
              ].map((stat, i) => (
                <div key={i} className="group">
                  <div className={`font-mono text-3xl md:text-5xl font-black mb-3 text-gray-900 group-hover:scale-110 transition-transform duration-500 ${stat.color}bg-clip-text`}>
                    {stat.val}
                  </div>
                  <div className="font-mono text-[10px] text-gray-400 font-black tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - Medium Rounded */}
        <section id="features" className="py-24 md:py-32">
          <div className="max-w-[1600px] mx-auto px-5 md:px-8">
            <div className="mb-20">
              <div className="font-mono text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6 border-l-2 border-blue-600 pl-4">
                Mentorship Architecture
              </div>
              <h2 className="font-syne text-4xl md:text-6xl font-black tracking-tighter text-gray-900 max-w-3xl uppercase">
                A COMPLETE AND <span className="char-red">A</span>U<span className="char-blue">T</span>O<span className="char-amber">M</span>A<span className="char-purple">T</span>ED LABORATORY
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {/* Module 1 */}
              <div className="spec-card group p-8 rounded-2xl relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 diagonal-pattern text-red-500 opacity-[0.03] pointer-events-none" />
                <div className="flex items-center justify-between mb-10">
                  <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center border-1.5 border-red-500/20 text-red-500 transition-transform duration-500 group-hover:scale-110">
                    <Terminal size={28} />
                  </div>
                  <span className="font-mono text-[9px] font-black text-gray-300 uppercase tracking-widest">MOD_01</span>
                </div>
                <h3 className="font-syne text-2xl font-bold mb-4 text-gray-900 uppercase">Elite Challenges</h3>
                <p className="font-grotesk text-gray-500 leading-relaxed mb-8 flex-1">
                  Take on challenges modeled after real production environments: from Go Micro-services to complex React Dashboards.
                </p>
                <div className="flex gap-2 pt-6 border-t border-gray-100 text-gray-300 font-mono text-[9px] font-bold uppercase tracking-widest">
                  <span className="hover:text-red-500 cursor-default">BEGINNER</span>
                  <span>•</span>
                  <span className="hover:text-red-500 cursor-default">INTERMEDIATE</span>
                  <span>•</span>
                  <span className="hover:text-red-500 cursor-default">EXPERT</span>
                </div>
              </div>

              {/* Module 2 */}
              <div className="spec-card group p-8 rounded-2xl relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 diagonal-pattern text-blue-500 opacity-[0.03] pointer-events-none" />
                <div className="flex items-center justify-between mb-10">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center border-1.5 border-blue-500/20 text-blue-500 transition-transform duration-500 group-hover:scale-110">
                    <Cpu size={28} />
                  </div>
                  <span className="font-mono text-[9px] font-black text-gray-300 uppercase tracking-widest">MOD_02</span>
                </div>
                <h3 className="font-syne text-2xl font-bold mb-4 text-gray-900 uppercase">IA-Deep Audit</h3>
                <p className="font-grotesk text-gray-500 leading-relaxed mb-8 flex-1">
                  Instant code review that identifies what your colleagues miss: sub-optimal patterns and logical flaws.
                </p>
                <div className="flex gap-2 pt-6 border-t border-gray-100 text-gray-300 font-mono text-[9px] font-bold uppercase tracking-widest">
                  <span className="hover:text-blue-500 cursor-default">VULNERABILITIES</span>
                  <span>•</span>
                  <span className="hover:text-blue-500 cursor-default">SYSTEM</span>
                  <span>•</span>
                  <span className="hover:text-blue-500 cursor-default">LOGIC</span>
                </div>
              </div>

              {/* Module 3 */}
              <div className="spec-card group p-8 rounded-2xl relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 diagonal-pattern text-amber-500 opacity-[0.03] pointer-events-none" />
                <div className="flex items-center justify-between mb-10">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center border-1.5 border-amber-500/20 text-amber-500 transition-transform duration-500 group-hover:scale-110">
                    <BarChart3 size={28} />
                  </div>
                  <span className="font-mono text-[9px] font-black text-gray-300 uppercase tracking-widest">MOD_03</span>
                </div>
                <h3 className="font-syne text-2xl font-bold mb-4 text-gray-900 uppercase">Career Blueprint</h3>
                <p className="font-grotesk text-gray-500 leading-relaxed mb-8 flex-1">
                  Visualize your skills on an evolving technical radar map. A portfolio that recruiters can actually audit.
                </p>
                <div className="flex gap-2 pt-6 border-t border-gray-100 text-gray-300 font-mono text-[9px] font-bold uppercase tracking-widest">
                  <span className="hover:text-amber-500 cursor-default">RADAR_XP</span>
                  <span>•</span>
                  <span className="hover:text-amber-500 cursor-default">SKILL_MAP</span>
                  <span>•</span>
                  <span className="hover:text-amber-500 cursor-default">DOCS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integration / How it Works - English */}
        <section id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
          
          <div className="max-w-[1600px] mx-auto px-5 md:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 lg:items-center gap-24">
              <div className="relative">
                 <div className="font-mono text-[10px] font-black text-red-500 uppercase tracking-widest mb-6 border-l-2 border-red-500 pl-4">
                  Technical Pipeline
                </div>
                <h2 className="font-syne text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mb-12 uppercase">
                  FROM REPOSITORY <br /> TO <span className="char-blue">S</span>U<span className="char-emerald">C</span>C<span className="char-purple">E</span>SS
                </h2>

                <div className="space-y-12">
                  {[
                    { title: "Push to GitHub", desc: "Connect your local repo. Every commit is an opportunity to learn.", icon: GithubIcon },
                    { title: "Multi-dim Audit", desc: "AI scans your architecture: Performance, Security, and Clean Code.", icon: Maximize2 },
                    { title: "Guided Refactoring", desc: "Receive concrete fixes. Apply, Push, Earn XP.", icon: Activity }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-8 group">
                      <div className="flex-shrink-0 relative">
                        <div className="w-12 h-12 bg-white border-1.5 border-gray-100 rounded-xl flex items-center justify-center text-gray-900 font-mono font-bold shadow-sm transition-transform group-hover:scale-110">
                          {idx + 1}
                        </div>
                        {idx < 2 && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-100" />}
                      </div>
                      <div className="pt-2">
                        <h4 className="font-syne text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                        <p className="font-grotesk text-gray-500 max-w-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-10 bg-blue-500/5 blur-3xl rounded-full" />
                <div className="relative p-1.5 bg-gray-100 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
                   <div className="bg-white rounded-2xl p-10 space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 diagonal-pattern text-gray-900 opacity-[0.02] w-32 h-32" />
                      
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border-1.5 border-emerald-500/20">
                               <ShieldCheck className="text-emerald-500" size={24} />
                            </div>
                            <div>
                               <div className="font-syne font-bold text-gray-900">Security Analyst</div>
                               <div className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">Active Pipeline</div>
                            </div>
                         </div>
                         <div className="font-mono text-2xl font-black text-emerald-500 tabular-nums tracking-tighter">98/100</div>
                      </div>

                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full w-[98%] bg-emerald-500 transition-all duration-1000" />
                      </div>

                      <div className="p-6 bg-gray-50/50 rounded-2xl border-1.5 border-dashed border-gray-200">
                         <div className="font-mono text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">REPORT_LOG_V42</div>
                         <p className="font-grotesk text-sm text-gray-600 leading-relaxed italic">
                            "Impeccable architecture. Your TypeScript types are strict and documented. Radar XP detected rare expertise in State Management."
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing - Hidden */}
        {/*
        <section id="pricing" className="py-24 md:py-32">
          ...
        </section>
        */}

        {/* CTA Banner - English & Medium Rounded */}
        <section className="py-24 px-5 md:px-8">
          <div className="max-w-[1600px] mx-auto rounded-2xl bg-gray-900 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute inset-0 diagonal-pattern text-blue-500 opacity-[0.03] pointer-events-none transition-all duration-1000 group-hover:scale-150" />
            
            <div className="relative z-10">
              <div className="font-mono text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] mb-8">Ready for Production?</div>
              <h2 className="font-syne text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase">
                INITIALIZE YOUR <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">TRANSFORMATION</span>
              </h2>
              <p className="font-grotesk text-gray-400 text-lg md:text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
                Join developers who are no longer satisfied with just "making code work" but seek to understand it in depth.
              </p>
              <button className="px-12 py-6 bg-white text-gray-900 font-mono text-sm font-black tracking-widest rounded-xl flex items-center gap-3 mx-auto transition-all hover:scale-105 active:scale-95 shadow-2xl uppercase">
                Start First Sprint
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer - English */}
        <footer className="py-20 border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-5 md:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-2">
                <Link href="/" className="flex items-center gap-3 mb-8 group">
                  <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm">
                    <AppIcon className="text-gray-900 w-6 h-6" />
                  </div>
                  <span className="font-syne text-xl font-bold tracking-tighter uppercase"><span className="text-gray-900">dev</span><span className="text-blue-600">Review</span> <span className="text-amber-500">AI</span></span>
                </Link>
                <p className="font-grotesk text-gray-500 max-w-sm leading-relaxed text-sm">
                  Artificial intelligence at the service of human expertise in software engineering. Powered by technical curiosity.
                </p>
              </div>
              
              <div>
                <h4 className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 font-mono">Module_Info</h4>
                <ul className="space-y-4 font-mono text-[10px] font-bold uppercase tracking-widest">
                  <li><Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">Challenges</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">Documentation</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">API_Reference</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 font-mono">Network_Nodes</h4>
                <ul className="space-y-4 font-mono text-[10px] font-bold uppercase tracking-widest">
                  <li><Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">Github</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">Discord_Server</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors">Status</Link></li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-gray-100 gap-6">
              <p className="text-gray-400 font-mono text-[9px] font-bold uppercase tracking-widest">
                © 2024 devReview AI. v4.2.0_alpha. Built for technical excellence.
              </p>
              <div className="flex items-center gap-8">
                <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors"><GithubIcon size={18} /></Link>
                <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors font-mono text-[9px] font-bold uppercase tracking-widest">Privacy_Policy</Link>
                <Link href="#" className="text-gray-400 hover:text-gray-900 transition-colors font-mono text-[9px] font-bold uppercase tracking-widest">Tech_Specs</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}