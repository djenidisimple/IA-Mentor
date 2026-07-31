"use client"

import { useEffect, useState } from "react"
import {
  Users, MessageCircle, Heart, TrendingUp, Sparkles,
  Copy, Check, AlertCircle, ArrowUpRight, GitBranch, Globe, Plus
} from "lucide-react"
import { socialApi } from "@/lib/social"
import { CommunityPost, SuggestedUser, TrendingTopic } from "@/types/social.types"
import { GithubIcon } from "@/components/icon"
import Link from "next/link"

type Tab = 'feed' | 'trending' | 'discover'

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [following, setFollowing] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('feed')
  const [commentingOn, setCommentingOn] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")
  const [copiedRepo, setCopiedRepo] = useState<number | null>(null)

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
    try { await socialApi.toggleLike(postId); } catch { }
  };

  const handleFollow = async (userId: number) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
    try { await socialApi.followUser(userId); } catch { }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const hours = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 3600000);
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  const addComment = async (postId: number) => {
    if (!newComment.trim()) return;
    try {
      await socialApi.addCommentToSubmission(postId, newComment);
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
      <div className="min-h-screen bg-[var(--cream)]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-[var(--border-pink)] pb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                      <div className="h-2 w-20 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 w-full rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                    <div className="h-4 w-3/4 rounded-full bg-gradient-to-r from-[var(--border-pink)] via-gray-200 to-[var(--border-pink)] bg-[length:200%_100%] animate-shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-[var(--cream)] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-[13px] font-medium uppercase tracking-widest text-[var(--gray)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <header className="bg-white border-b border-[var(--border-pink)]">
        <div className="max-w-[1200px] mx-auto px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[var(--blue)] rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--blue)]">
                  {posts.length} soumissions partagées
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--navy)] tracking-tight">
                Communauté
              </h1>
            </div>

            <div className="flex gap-6 border-b border-transparent">
              {[
                { id: 'feed' as Tab, label: 'FIL D\'ACTUALITÉ' },
                { id: 'trending' as Tab, label: 'TENDANCES' },
                { id: 'discover' as Tab, label: 'DÉCOUVRIR' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`pb-2 text-sm font-bold transition-all relative ${
                    activeTab === t.id ? 'text-[var(--navy)]' : 'text-[var(--gray)] hover:text-[var(--navy)]'
                  }`}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[var(--blue)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-8 sm:py-12">
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <article key={post.id} className="group border-b border-[var(--border-pink)] pb-12 last:border-0">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[var(--cream)] border border-[var(--border-pink)] rounded-xl flex items-center justify-center font-bold text-sm text-[var(--navy)] overflow-hidden">
                          {post.author.avatar ? (
                            <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                          ) : post.author.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[var(--navy)]">@{post.author.username}</span>
                            {post.author.isPremium && (
                              <span className="text-[9px] font-bold border border-amber-200 text-amber-600 px-1.5 py-0.5 rounded-full">PRO</span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-[var(--gray)] uppercase tracking-wider">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Link href={`community/${post.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-5 h-5 text-[var(--gray)] hover:text-[var(--blue)]" />
                      </Link>
                    </div>

                    <p className="text-sm leading-relaxed text-[var(--gray)] mb-4 max-w-2xl">
                      A complété le challenge :{" "}
                      <Link href={`/challenges/${post.challengeSlug}`} className="font-bold text-[var(--navy)] hover:text-[var(--blue)] transition-colors">
                        {post.challengeTitle}
                      </Link>
                    </p>

                    {post.score != null && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                          post.score >= 50
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-orange-50 border-orange-200 text-orange-700'
                        }`}>
                          <Sparkles size={12} />
                          Note IA • {post.score}/100
                        </span>
                      </div>
                    )}

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-[var(--blue)] bg-[var(--blue)]/5 border border-[var(--blue)]/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {post.githubUrl && (
                      <div className="mb-6 border border-[var(--border-pink)] rounded-xl overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-2.5 bg-[var(--cream)] border-b border-[var(--border-pink)]">
                          <div className="flex items-center gap-2 min-w-0">
                            <GithubIcon size={14} className="text-[var(--navy)] shrink-0" />
                            <span className="text-[11px] font-bold text-[var(--navy)] truncate">{post.repoName}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(post.githubUrl);
                                setCopiedRepo(post.id);
                                setTimeout(() => setCopiedRepo(null), 2000);
                              }}
                              className="text-[var(--gray)] hover:text-[var(--navy)]"
                              title="Copier l'URL"
                            >
                              {copiedRepo === post.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={post.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--blue)] hover:text-[var(--navy)]"
                            >
                              Voir le repo <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                          post.isLiked ? 'text-red-500' : 'text-[var(--gray)] hover:text-[var(--navy)]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </button>
                      <button
                        onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gray)] hover:text-[var(--navy)] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--gray)]">
                        <GitBranch className="w-4 h-4" />
                        {post.shares}
                      </span>
                    </div>

                    {commentingOn === post.id && (
                      <div className="mt-6 flex gap-3">
                        <input
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') addComment(post.id) }}
                          placeholder="Ajouter une revue technique..."
                          className="flex-1 border-b border-[var(--border-pink)] py-2 text-sm focus:outline-none focus:border-[var(--blue)] transition-colors bg-transparent"
                        />
                        <button className="text-[var(--blue)] font-bold text-xs uppercase tracking-widest" onClick={() => addComment(post.id)}>Publier</button>
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <div className="text-center py-20 border border-dashed border-[var(--border-pink)] rounded-xl">
                  <Users className="w-6 h-6 text-[var(--gray)] mx-auto mb-3" />
                  <p className="text-[var(--gray)] text-sm font-bold">Aucune soumission partagée pour le moment.</p>
                  <Link href="/challenges" className="inline-flex items-center gap-2 mt-4 text-[11px] font-bold uppercase tracking-widest text-[var(--blue)]">
                    <Plus className="w-3.5 h-3.5" /> Relever un défi
                  </Link>
                </div>
              )}
            </div>

            <aside className="space-y-16">
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-4 h-4 text-[var(--blue)]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]">Sujets Tendances</h3>
                </div>
                <div className="space-y-6">
                  {trendingTopics.map(topic => (
                    <div key={topic.id} className="group cursor-pointer">
                      <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-widest mb-1">{topic.category}</p>
                      <h4 className="text-sm font-bold text-[var(--navy)] group-hover:text-[var(--blue)] transition-colors flex items-center gap-2">
                        #{topic.tag}
                      </h4>
                      <p className="text-xs text-[var(--gray)] mt-1">{topic.posts} défis</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-8">
                  <Users className="w-4 h-4 text-[var(--blue)]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]">Membres actifs</h3>
                </div>
                <div className="space-y-6">
                  {suggestedUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-[var(--cream)] border border-[var(--border-pink)] rounded-full flex items-center justify-center font-bold text-xs text-[var(--navy)] overflow-hidden shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : user.username[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[var(--navy)] truncate">@{user.username}</p>
                          <p className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-wider">{user.reason}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollow(user.id)}
                        disabled={following.has(user.id)}
                        className={`shrink-0 text-[10px] font-bold uppercase tracking-wider border rounded-full px-3 py-1.5 transition-colors ${
                          following.has(user.id)
                            ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
                            : 'border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white'
                        }`}
                      >
                        {following.has(user.id) ? 'Suivi' : 'Suivre'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="p-8 bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl hover:shadow-xl transition-all">
                <Sparkles className="w-5 h-5 text-[var(--blue)] mb-4" />
                <h3 className="text-lg font-bold text-[var(--navy)] mb-2">DevChallenge Pro</h3>
                <p className="text-sm text-[var(--gray)] mb-6 leading-relaxed">
                  Accédez aux audits de code par IA avancée et à la communauté privée.
                </p>
                <button className="w-full py-3 bg-[var(--navy)] text-white rounded-full text-[11px] font-bold uppercase tracking-wider hover:bg-[#2A3050] transition-all shadow-lg shadow-[var(--navy)]/10">
                  Améliorer mon compte
                </button>
              </section>
            </aside>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingTopics.map((topic, i) => (
                  <div key={topic.id} className="p-6 bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-[var(--gray)] uppercase tracking-widest">{topic.category}</span>
                      <span className="text-[22px] font-black text-[var(--border-pink)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-[var(--navy)] mb-2">#{topic.tag}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--gray)] uppercase tracking-wider">{topic.posts} défis</span>
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[var(--blue)]" />
                        <span className="text-[10px] font-bold text-[var(--blue)] uppercase tracking-wider">En direct</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-16">
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp className="w-4 h-4 text-[var(--blue)]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]">À propos</h3>
                </div>
                <div className="p-8 bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl">
                  <p className="text-sm text-[var(--gray)] leading-relaxed">
                    Les tendances reflètent les technologies utilisées dans les challenges de la plateforme. Relevez les défis qui vous intéressent et faites monter ces sujets.
                  </p>
                  <Link href="/challenges" className="inline-flex items-center gap-2 mt-6 text-[11px] font-bold uppercase tracking-widest text-[var(--blue)] hover:text-[var(--navy)] transition-colors">
                    Voir les défis <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedUsers.map((user, i) => (
                  <div key={user.id} className="p-6 bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[var(--cream)] border border-[var(--border-pink)] rounded-full flex items-center justify-center font-bold text-sm text-[var(--navy)] overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : user.username[0].toUpperCase()}
                      </div>
                      <span className="text-[11px] font-bold text-[var(--gray)] tabular-nums">#{i + 1}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-[var(--navy)] mb-1">@{user.username}</h4>
                    <p className="text-xs text-[var(--gray)] mb-4">{user.reason}</p>
                    <button
                      onClick={() => handleFollow(user.id)}
                      disabled={following.has(user.id)}
                      className={`w-full py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                        following.has(user.id)
                          ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
                          : 'border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white'
                      }`}
                    >
                      {following.has(user.id) ? 'Suivi ✓' : 'Suivre'}
                    </button>
                  </div>
                ))}
                {suggestedUsers.length === 0 && (
                  <div className="col-span-full text-center py-20 border border-dashed border-[var(--border-pink)] rounded-xl">
                    <Users className="w-6 h-6 text-[var(--gray)] mx-auto mb-3" />
                    <p className="text-[var(--gray)] text-sm font-bold">Aucun membre à suggérer pour le moment.</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-16">
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <Users className="w-4 h-4 text-[var(--blue)]" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]">Pourquoi suivre ?</h3>
                </div>
                <div className="p-8 bg-white border border-[var(--border-pink)] rounded-xl sm:rounded-2xl">
                  <p className="text-sm text-[var(--gray)] leading-relaxed">
                    Suivez les développeurs les plus actifs, découvrez leurs solutions et échangez des revues techniques de qualité.
                  </p>
                  <Link href="/leaderboard" className="inline-flex items-center gap-2 mt-6 text-[11px] font-bold uppercase tracking-widest text-[var(--blue)] hover:text-[var(--navy)] transition-colors">
                    Voir le classement <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
