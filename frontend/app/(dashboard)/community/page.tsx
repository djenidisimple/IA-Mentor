"use client"

import { useEffect, useState } from "react"
import { 
  Users, UserPlus, MessageCircle, Heart, TrendingUp, Sparkles,
  Clock, Send, Copy, Check, Zap, AlertCircle,
  Globe
} from "lucide-react"
import { socialApi } from "@/lib/social" 
import { CommunityPost, SuggestedUser, TrendingTopic } from "@/types/social.types"

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'discover'>('feed')
  const [commentingOn, setCommentingOn] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("")
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [postsData, trendingData, usersData] = await Promise.all([
          socialApi.getFeed(),
          socialApi.getTrending(),
          socialApi.getSuggestions()
        ])
        
        // Sécurité critique : on s'assure que c'est toujours un tableau
        setPosts(Array.isArray(postsData) ? postsData : [])
        setTrendingTopics(Array.isArray(trendingData) ? trendingData : [])
        setSuggestedUsers(Array.isArray(usersData) ? usersData : [])
      } catch (err: any) {
        console.error("Erreur de synchronisation backend:", err)
        setError(err.message || "Impossible de charger les données.")
      } finally {
        setLoading(false)
        setTimeout(() => setIsVisible(true), 100)
      }
    }

    loadData()
  }, [])

  const handleLike = async (postId: number) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) }
        : post
    ))
    try {
      await socialApi.toggleLike(postId)
    } catch (error) {
      // Rollback
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? 1 : -1) }
          : post
      ))
    }
  }

  const handleComment = async (submissionId: number) => {
    if (!newComment.trim()) return
    try {
      await socialApi.addCommentToSubmission(submissionId, newComment)
      setPosts(prev => prev.map(post => 
        post.id === submissionId ? { ...post, comments: post.comments + 1 } : post
      ))
      setNewComment("")
      setCommentingOn(null)
    } catch (error) {
      console.error("Erreur commentaire:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const diff = new Date().getTime() - date.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours < 1) return "À l'instant"
      if (hours < 24) return `il y a ${hours}h`
      return `il y a ${Math.floor(hours / 24)}j`
    } catch { return "Récemment" }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-600 rounded-xl mb-4 flex items-center justify-center shadow-lg shadow-blue-200">
            <Users className="text-white" />
          </div>
          <p className="text-gray-500 font-bold">Synchronisation avec DevReview AI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        
        {/* Header */}
        <div className={`mb-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-100">
                <Zap className="h-6 w-6 fill-current" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">DevConnect</h1>
                <p className="text-slate-500 text-sm font-medium">Le fil technique de la communauté</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
            {['feed', 'trending', 'discover'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                  activeTab === t ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {t === 'feed' ? 'Fil d\'actualité' : t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Feed Principal */}
          <div className="lg:col-span-2 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 font-medium">
                <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}

            {posts && posts.length > 0 ? (
              posts.map((post, idx) => (
                <article 
                  key={post.id}
                  className={`bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-blue-600 font-black text-xl border border-slate-200 overflow-hidden">
                        {post.author.avatar ? <img src={post.author.avatar} alt="avatar" className="w-full h-full object-cover" /> : post.author.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-lg">{post.author.username}</h4>
                          {post.author.isPremium && <span className="bg-amber-100 text-amber-700 text-[10px] px-2.5 py-1 rounded-lg font-black tracking-wider flex items-center gap-1">PRO</span>}
                        </div>
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                          <Clock className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-base mb-6 font-medium">{post.content}</p>

                  {post.code && post.code.snippet && (
                    <div className="bg-slate-900 rounded-3xl overflow-hidden mb-6 border border-slate-800 shadow-2xl">
                      <div className="flex justify-between items-center px-5 py-3 bg-slate-800/50 border-b border-slate-800">
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] font-bold">{post.code.language}</span>
                        <button 
                          onClick={() => { 
                            navigator.clipboard.writeText(post.code!.snippet); 
                            setCopiedCodeId(post.id); 
                            setTimeout(() => setCopiedCodeId(null), 2000)
                          }} 
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {copiedCodeId === post.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <pre className="p-6 text-[13px] font-mono text-slate-300 overflow-x-auto custom-scrollbar">
                        <code>{post.code.snippet}</code>
                      </pre>
                    </div>
                  )}

                  <div className="flex items-center gap-8 pt-6 border-t border-slate-50">
                    <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2.5 font-bold text-sm transition-all ${post.isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}>
                      <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-current scale-110' : ''}`} />
                      {post.likes}
                    </button>
                    <button onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)} className="flex items-center gap-2.5 font-bold text-sm text-slate-400 hover:text-blue-600 transition-all">
                      <MessageCircle className="h-6 w-6" />
                      {post.comments}
                    </button>
                  </div>

                  {commentingOn === post.id && (
                    <div className="mt-6 flex gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                      <input 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                        placeholder="Écrire une review technique..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <button onClick={() => handleComment(post.id)} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95">
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 p-20 rounded-[40px] text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">Le fil est vide</h3>
                <p className="text-slate-500 text-sm mt-1">Sois le premier à soumettre un challenge !</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-3 text-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" /> Trending
              </h3>
              <div className="space-y-5">
                {trendingTopics.map(topic => (
                  <div key={topic.id} className="group cursor-pointer">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{topic.category}</p>
                    <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">#{topic.tag}</h4>
                    <p className="text-xs text-slate-400 mt-1">{topic.posts} partages cette semaine</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <Sparkles className="h-8 w-8 text-amber-400 mb-4" />
                <h3 className="text-xl font-black mb-2">DevReview Pro</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Accède aux revues de code générées par nos modèles d'IA les plus avancés.</p>
                <button className="w-full bg-white text-slate-900 py-3 rounded-2xl font-black text-sm hover:bg-amber-400 transition-all active:scale-95">
                  Upgrade Now
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}