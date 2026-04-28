"use client"

import { useEffect, useState } from "react"
import { 
  Users, MessageCircle, Heart, TrendingUp, Sparkles,
  Clock, Send, Copy, Check, Zap, AlertCircle,
  Globe, ArrowUpRight
} from "lucide-react"
import { socialApi } from "@/lib/social" 
import { CommunityPost, SuggestedUser, TrendingTopic } from "@/types/social.types"
import Link from "next/link"

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'discover'>('feed')
  const [commentingOn, setCommentingOn] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [postsData, trendingData, usersData] = await Promise.all([
          socialApi.getFeed(),
          socialApi.getTrending(),
          socialApi.getSuggestions()
        ]);
        setPosts(Array.isArray(postsData) ? postsData : []);
        setTrendingTopics(Array.isArray(trendingData) ? trendingData : []);
        setSuggestedUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err: any) {
        setError(err.message || "Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLike = async (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) } : post
    ));
    try { await socialApi.toggleLike(postId); } catch { /* logique de rollback */ }
  };

  const formatDate = (dateStr: string) => {
    const hours = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 3600000);
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  const addComment = async (postId: number) => {
    if (!newComment.trim()) return;
    try {
      const comment = await socialApi.addCommentToSubmission(postId, newComment);
      setPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, comments: post.comments + 1 } : post
      ));
      setNewComment("");
      setCommentingOn(null);
    }
    catch (err) {
      console.error("Erreur lors de l'ajout du commentaire:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-['Outfit']">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#0052FF] animate-spin mb-4" />
        <p className="text-[13px] font-medium uppercase tracking-widest text-slate-400">Chargement de la communauté</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-['Outfit']">
      {/* ── Section En-tête ── */}
      <header className="border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[#0052FF] rotate-45" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0052FF]">
                  Flux Réseau
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#0D0D0D]">
                Communauté <span className="text-slate-300">/</span> DevConnect
              </h1>
            </div>

            {/* Navigation par onglets */}
            <div className="flex gap-8 border-b border-transparent">
              {[
                { id: 'feed', label: 'FIL D\'ACTUALITÉ' },
                { id: 'trending', label: 'TENDANCES' },
                { id: 'discover', label: 'DÉCOUVRIR' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`pb-2 text-sm font-semibold transition-all relative ${
                    activeTab === t.id ? 'text-[#0D0D0D]' : 'text-slate-400 hover:text-[#0D0D0D]'
                  }`}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#0052FF]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* ── Flux Principal ── */}
          <div className="lg:col-span-2 space-y-12">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.id} className="group border-b border-slate-100 pb-12 last:border-0">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="
                          w-10 h-10 
                        bg-slate-100 border 
                        border-slate-200 flex items-center justify-center font-bold text-[13px] text-[#0D0D0D]
                          rounded-full overflow-hidden
                        "
                      >
                        {post.author.avatar ? (
                          <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                        ) : post.author.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[15px] text-[#0D0D0D]">@{post.author.username}</span>
                          {post.author.isPremium && (
                            <span className="text-[9px] font-black border border-amber-200 text-amber-600 px-1.5 py-0.5">PRO</span>
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Link href={`community/${post.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-5 h-5 text-slate-300 hover:text-[#0052FF]" />
                    </Link>
                  </div>

                  <p className="text-[16px] leading-relaxed text-slate-600 mb-6 max-w-2xl">
                    {post.content}
                  </p>

                  {post.code && (
                    <div className="mb-6 border border-slate-200">
                      <div className="flex justify-between items-center px-4 py-2 bg-slate-50 border-b border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.code.language}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(post.code!.snippet);
                            setCopiedCodeId(post.id);
                            setTimeout(() => setCopiedCodeId(null), 2000);
                          }}
                          className="text-slate-400 hover:text-[#0D0D0D]"
                        >
                          {copiedCodeId === post.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <pre className="p-5 text-[13px] font-mono text-slate-700 overflow-x-auto bg-white">
                        <code>{post.code.snippet}</code>
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-colors ${
                        post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-[#0D0D0D]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </button>
                    <button 
                      onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#0D0D0D] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </button>
                  </div>

                  {commentingOn === post.id && (
                    <div className="mt-6 flex gap-3">
                      <input 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ajouter une revue technique..."
                        className="flex-1 border-b border-slate-200 py-2 text-sm focus:outline-none focus:border-[#0052FF] transition-colors"
                      />
                      <button className="text-[#0052FF] font-bold text-xs uppercase tracking-widest" onClick={() => addComment(post.id)}>Publier</button>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="text-center py-20 border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">Aucun message pour le moment.</p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-16">
            <section>
              <div className="flex items-center gap-2 mb-8">
                <TrendingUp className="w-4 h-4 text-[#0052FF]" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-[#0D0D0D]">Sujets Tendances</h3>
              </div>
              <div className="space-y-6">
                {trendingTopics.map(topic => (
                  <div key={topic.id} className="group cursor-pointer">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{topic.category}</p>
                    <h4 className="text-[15px] font-bold text-[#0D0D0D] group-hover:text-[#0052FF] transition-colors flex items-center gap-2">
                      #{topic.tag}
                    </h4>
                    <p className="text-[12px] text-slate-400 mt-1">{topic.posts} discussions</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-8 border-2 border-[#0D0D0D] relative">
              <Sparkles className="w-5 h-5 text-[#0052FF] mb-4" />
              <h3 className="text-lg font-bold mb-2">DevReview Pro</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Accédez aux audits de code par IA avancée et à la communauté privée.
              </p>
              <button className="w-full py-3 bg-[#0D0D0D] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#0052FF] transition-colors">
                Améliorer mon compte
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}