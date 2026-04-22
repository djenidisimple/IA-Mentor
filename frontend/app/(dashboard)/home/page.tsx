'use client'

import { useEffect, useState } from 'react'
import { 
  Brain, AlertCircle, Plus, Zap, 
  Terminal, BarChart3, ArrowUpRight, 
  Activity, ShieldCheck, Code2, Sparkles,
  TrendingUp, Users, Target, Crown,
  MessageCircle, Heart, Bookmark, Send,
  Coffee, Rocket, Flame,
  Trophy
} from 'lucide-react'
import { useSubmissions } from '@/hooks/useSubmissions'
import { usePostInteractions } from '@/hooks/usePostInteractions'
import SubmissionsList from '@/components/submissions/SubmissionsList'
import Link from 'next/link'

export default function Home() {
  const { submissions, loading } = useSubmissions()
  const {
    likedPosts,
    savedPosts,
    commentingOn,
    comments,
    expandedFeedback,
    handleLike,
    handleSave,
    handleComment,
    toggleFeedback,
    setComments,
    setCommentingOn,
  } = usePostInteractions()

  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('feed')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" />
        </div>
        <p className="mt-8 text-white font-bold text-lg animate-pulse">
          Loading amazing stuff...
        </p>
      </div>
    )
  }

  if (!isVisible) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation Flottante */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  DevReview
                </h2>
                <p className="text-xs text-gray-500">AI Powered Reviews</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/submit"
                className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Submission
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        
        {/* Hero Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-yellow-300" />
                  <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    Welcome Back
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Your Code Review
                  <br />
                  <span className="text-yellow-300">Control Center</span>
                </h1>
                <p className="text-white/90 text-lg max-w-2xl">
                  Get AI-powered insights, track your progress, and collaborate with developers worldwide.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">1.2k</p>
                  <p className="text-sm opacity-90">Developers</p>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{submissions.length}</p>
                  <p className="text-sm opacity-90">Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: TrendingUp, label: 'Trending', color: 'from-blue-500 to-cyan-500' },
            { icon: Flame, label: 'Popular', color: 'from-orange-500 to-red-500' },
            { icon: Rocket, label: 'Latest', color: 'from-green-500 to-emerald-500' },
            { icon: Coffee, label: 'For You', color: 'from-purple-500 to-pink-500' },
          ].map((item, index) => (
            <button
              key={index}
              className={`group relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <item.icon className={`w-8 h-8 mb-3 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
              <p className="font-semibold text-gray-800">{item.label}</p>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Feed (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-600" />
                Recent Activity
              </h2>
              <div className="flex gap-2">
                {['Feed', 'Following', 'Trending'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      activeTab === tab.toLowerCase()
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border-2 border-dashed border-gray-200">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No submissions yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share your code for review!</p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Create First Submission
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              </div>
            )}
          </div>

          {/* Right Column - Sidebar (1 column) */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Alex Developer</h3>
                  <p className="text-white/80">Senior Developer</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{submissions.length}</p>
                  <p className="text-xs text-white/70">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">284</p>
                  <p className="text-xs text-white/70">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">1.2k</p>
                  <p className="text-xs text-white/70">Points</p>
                </div>
              </div>
              <button className="w-full py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all">
                View Profile
              </button>
            </div>

            {/* Skill Matrix */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Skill Matrix
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Frontend', value: 92, color: 'from-purple-500 to-pink-500' },
                  { label: 'Backend', value: 78, color: 'from-blue-500 to-cyan-500' },
                  { label: 'DevOps', value: 65, color: 'from-green-500 to-emerald-500' },
                  { label: 'Security', value: 45, color: 'from-orange-500 to-red-500' },
                ].map((skill) => (
                  <div key={skill.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{skill.label}</span>
                      <span className="font-bold text-gray-900">{skill.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${isVisible ? skill.value : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Activity */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Live Activity
              </h3>
              <div className="space-y-4">
                {[
                  { user: 'Sarah Chen', action: 'reviewed', project: 'React Dashboard', time: '2m ago', color: 'bg-green-500' },
                  { user: 'Mike Ross', action: 'commented on', project: 'API Design', time: '5m ago', color: 'bg-blue-500' },
                  { user: 'Emma Watson', action: 'starred', project: 'UI Components', time: '12m ago', color: 'bg-yellow-500' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${activity.color} rounded-full animate-pulse`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium">{activity.project}</span>
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8" />
                <div>
                  <h4 className="font-bold text-lg">Achievement Unlocked!</h4>
                  <p className="text-sm opacity-90">Code Master Level 5</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm mb-2">Next Achievement</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/30 rounded-full">
                    <div className="w-3/4 h-full bg-white rounded-full" />
                  </div>
                  <span className="text-sm font-semibold">75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform">
        <MessageCircle className="w-6 h-6" />
      </button>
    </main>
  )
}