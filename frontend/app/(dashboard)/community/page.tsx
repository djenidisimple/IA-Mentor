'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Code, 
  Star, 
  Zap,
  Award,
  Flame,
  Calendar,
  MapPin,
  Search,
  Filter,
  Plus,
  UserPlus,
  Check,
  MoreVertical,
  Globe,
  Coffee,
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  User,
  Clock,
  X
} from 'lucide-react'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { Button } from '@/components/ui/Button'

// Icônes sociales personnalisées (car non disponibles dans lucide-react)
const GithubIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
  </svg>
)

interface CommunityUser {
  id: number
  username: string
  fullName: string
  avatarUrl: string
  bio: string
  location: string
  joinDate: string
  points: number
  challengesCompleted: number
  streak: number
  followers: number
  following: number
  isFollowing: boolean
  badges: string[]
  languages: string[]
  socialLinks: {
    github?: string
    twitter?: string
    linkedin?: string
  }
  lastActive: string
}

interface Post {
  id: number
  userId: number
  user: {
    username: string
    fullName: string
    avatarUrl: string
  }
  content: string
  codeSnippet?: string
  language?: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  createdAt: string
  tags: string[]
}

// 📦 DONNÉES MOCKÉES (identiques à avant)
const mockUsers: CommunityUser[] = [
  {
    id: 1,
    username: "code_master",
    fullName: "Thomas Anderson",
    avatarUrl: "",
    bio: "Architecte logiciel spécialisé dans les systèmes distribués. Passionné par Java, Spring Cloud et les microservices. 15+ ans d'expérience.",
    location: "Paris, France",
    joinDate: "2024-01-15",
    points: 12500,
    challengesCompleted: 47,
    streak: 15,
    followers: 234,
    following: 89,
    isFollowing: false,
    badges: ["👑 Champion", "⚡ Speedster", "🔒 Security Expert"],
    languages: ["Java", "Spring Boot", "Docker"],
    socialLinks: {
      github: "codemaster",
      twitter: "codemaster_dev",
      linkedin: "thomas-anderson"
    },
    lastActive: "2024-03-30T10:30:00"
  },
  {
    id: 2,
    username: "clean_coder",
    fullName: "Sarah Chen",
    avatarUrl: "",
    bio: "Clean code advocate. Expert en architecture hexagonale et DDD. Je partage mes connaissances sur les bonnes pratiques.",
    location: "Montréal, Canada",
    joinDate: "2024-02-01",
    points: 11200,
    challengesCompleted: 42,
    streak: 12,
    followers: 189,
    following: 67,
    isFollowing: true,
    badges: ["🏆 Elite", "📐 Architect"],
    languages: ["C#", ".NET", "Azure"],
    socialLinks: {
      github: "cleancoder",
      twitter: "sarah_chen",
      linkedin: "sarah-chen"
    },
    lastActive: "2024-03-30T09:15:00"
  },
  {
    id: 3,
    username: "bug_hunter",
    fullName: "Marcus Williams",
    avatarUrl: "",
    bio: "Debugging is my superpower. Spécialiste en performance et optimisation. Rust & Go enthusiast.",
    location: "Berlin, Allemagne",
    joinDate: "2024-01-20",
    points: 9800,
    challengesCompleted: 38,
    streak: 8,
    followers: 156,
    following: 45,
    isFollowing: false,
    badges: ["🐛 Bug Hunter", "⚡ Performance"],
    languages: ["Rust", "Go", "Python"],
    socialLinks: {
      github: "bug_hunter",
      twitter: "marcus_dev"
    },
    lastActive: "2024-03-29T22:00:00"
  },
  {
    id: 4,
    username: "dev_warrior",
    fullName: "Léa Dubois",
    avatarUrl: "",
    bio: "Fullstack developer. React, Node.js, MongoDB. Créative et passionnée par les UI/UX.",
    location: "Lyon, France",
    joinDate: "2024-02-10",
    points: 8900,
    challengesCompleted: 35,
    streak: 6,
    followers: 134,
    following: 78,
    isFollowing: false,
    badges: ["🔥 Warrior"],
    languages: ["JavaScript", "React", "Node.js"],
    socialLinks: {
      github: "dev_warrior",
      twitter: "lea_dev",
      linkedin: "lea-dubois"
    },
    lastActive: "2024-03-30T08:45:00"
  },
  {
    id: 5,
    username: "alchemist",
    fullName: "David Kim",
    avatarUrl: "",
    bio: "DevOps engineer. Kubernetes, Docker, CI/CD. Automatisation et infrastructure as code.",
    location: "Seoul, Corée du Sud",
    joinDate: "2024-01-05",
    points: 8200,
    challengesCompleted: 32,
    streak: 10,
    followers: 98,
    following: 34,
    isFollowing: false,
    badges: ["✨ Alchemist", "🎯 Precision"],
    languages: ["Python", "Go", "Terraform"],
    socialLinks: {
      github: "alchemist_dev",
      linkedin: "david-kim"
    },
    lastActive: "2024-03-29T14:20:00"
  },
  {
    id: 6,
    username: "tech_guru",
    fullName: "Elena Petrova",
    avatarUrl: "",
    bio: "Tech lead & mentor. Passionnée par l'IA et le machine learning. Python & TensorFlow.",
    location: "Moscou, Russie",
    joinDate: "2024-02-15",
    points: 7800,
    challengesCompleted: 30,
    streak: 5,
    followers: 212,
    following: 56,
    isFollowing: true,
    badges: ["📚 Guru"],
    languages: ["Python", "TensorFlow", "FastAPI"],
    socialLinks: {
      github: "tech_guru",
      twitter: "elena_ai"
    },
    lastActive: "2024-03-30T11:00:00"
  }
]

const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    user: {
      username: "code_master",
      fullName: "Thomas Anderson",
      avatarUrl: ""
    },
    content: "Je viens de terminer le challenge 'API REST Sécurisée' avec un score de 96% ! Les JWT sont vraiment puissants quand on les maîtrise.",
    codeSnippet: `@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests()
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .oauth2ResourceServer().jwt();
        return http.build();
    }
}`,
    language: "Java",
    likes: 42,
    comments: 12,
    shares: 5,
    isLiked: false,
    createdAt: "2024-03-30T08:30:00",
    tags: ["spring-security", "jwt", "api"]
  },
  {
    id: 2,
    userId: 2,
    user: {
      username: "clean_coder",
      fullName: "Sarah Chen",
      avatarUrl: ""
    },
    content: "L'architecture hexagonale change la donne ! Découplage parfait et tests beaucoup plus simples. Qui d'autre utilise cette approche ?",
    codeSnippet: `// Port interface
public interface UserRepositoryPort {
    User findById(Long id);
    User save(User user);
}

// Adapter implementation
@Repository
public class UserRepositoryAdapter implements UserRepositoryPort {
    private final JpaRepository<User, Long> jpaRepository;
    
    @Override
    public User findById(Long id) {
        return jpaRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }
}`,
    language: "Java",
    likes: 38,
    comments: 15,
    shares: 8,
    isLiked: true,
    createdAt: "2024-03-29T15:20:00",
    tags: ["hexagonal-architecture", "ddd", "clean-code"]
  },
  {
    id: 3,
    userId: 3,
    user: {
      username: "bug_hunter",
      fullName: "Marcus Williams",
      avatarUrl: ""
    },
    content: "Rust est incroyable pour les performances ! J'ai réduit le temps de réponse de mon API de 300ms à 45ms. 🔥",
    codeSnippet: `use actix_web::{web, App, HttpServer, Responder};

async fn hello() -> impl Responder {
    format!("Hello from Rust with {}ms response!", 
        calculate_response_time())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(hello))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}`,
    language: "Rust",
    likes: 67,
    comments: 23,
    shares: 12,
    isLiked: false,
    createdAt: "2024-03-29T20:45:00",
    tags: ["rust", "performance", "actix-web"]
  },
  {
    id: 4,
    userId: 4,
    user: {
      username: "dev_warrior",
      fullName: "Léa Dubois",
      avatarUrl: ""
    },
    content: "Petite astuce React : utilisez les custom hooks pour réutiliser la logique d'authentification !",
    codeSnippet: `function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token).then(setUser);
    }
    setLoading(false);
  }, []);
  
  const login = async (credentials) => {
    const response = await api.login(credentials);
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };
  
  return { user, loading, login, logout };
}`,
    language: "JavaScript",
    likes: 54,
    comments: 8,
    shares: 15,
    isLiked: false,
    createdAt: "2024-03-30T09:15:00",
    tags: ["react", "hooks", "authentication"]
  },
  {
    id: 5,
    userId: 5,
    user: {
      username: "alchemist",
      fullName: "David Kim",
      avatarUrl: ""
    },
    content: "Docker multi-stage builds = images 80% plus légères ! Un game changer pour la prod.",
    codeSnippet: `# Build stage
      FROM maven:3.8.4-openjdk-17-slim AS build
      COPY src /app/src
      COPY pom.xml /app
      RUN mvn -f /app/pom.xml clean package

      # Run stage
      FROM openjdk:17-slim
      COPY --from=build /app/target/app.jar /app/app.jar
      EXPOSE 8080
      ENTRYPOINT ["java", "-jar", "/app/app.jar"]`,
    language: "Dockerfile",
    likes: 89,
    comments: 31,
    shares: 42,
    isLiked: true,
    createdAt: "2024-03-28T12:00:00",
    tags: ["docker", "devops", "optimization"]
  },
  {
    id: 6,
    userId: 6,
    user: {
      username: "tech_guru",
      fullName: "Elena Petrova",
      avatarUrl: ""
    },
    content: "Nouveau challenge ML disponible ! Créez un système de recommandation avec TensorFlow.",
    codeSnippet: null,
    language: null,
    likes: 124,
    comments: 45,
    shares: 67,
    isLiked: false,
    createdAt: "2024-03-30T10:00:00",
    tags: ["machine-learning", "tensorflow", "ai"]
  }
]

export default function CommunityPage() {
  const router = useRouter()
  const { isAuthenticated, user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<CommunityUser[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"feed" | "members">("feed")
  const [selectedUser, setSelectedUser] = useState<CommunityUser | null>(null)
  const [followingUsers, setFollowingUsers] = useState<number[]>([])
  const [likedPosts, setLikedPosts] = useState<number[]>([])
  const [newPost, setNewPost] = useState("")
  const [showNewPostModal, setShowNewPostModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      setUsers(mockUsers)
      setPosts(mockPosts)
      setFollowingUsers(mockUsers.filter(u => u.isFollowing).map(u => u.id))
      setLikedPosts(mockPosts.filter(p => p.isLiked).map(p => p.id))
      setLoading(false)
    }
    loadData()
  }, [])

  const handleFollow = (userId: number) => {
    setFollowingUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleLike = (postId: number) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + (post.isLiked ? -1 : 1), isLiked: !post.isLiked }
        : post
    ))
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return
    
    const newPostObj: Post = {
      id: Date.now(),
      userId: currentUser?.id || 0,
      user: {
        username: currentUser?.username || "current_user",
        fullName: currentUser?.username || "Current User",
        avatarUrl: ""
      },
      content: newPost,
      codeSnippet: null,
      language: null,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      tags: []
    }
    
    setPosts([newPostObj, ...posts])
    setNewPost("")
    setShowNewPostModal(false)
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
    
    if (diff < 60) return `il y a ${diff} min`
    if (diff < 1440) return `il y a ${Math.floor(diff / 60)}h`
    return `le ${date.toLocaleDateString()}`
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-[#1A1919] text-[#F2E9E2]">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#D64933]/10 border-l-4 border-[#D64933] px-4 py-2 mb-4">
            <Users className="h-3 w-3 text-[#D64933]" />
            <span className="text-[#E8C547] text-[10px] font-mono font-bold tracking-[2px]">COMMUNAUTÉ</span>
          </div>
          <h1 className="text-5xl font-black tracking-[-3px]">
            LA <span className="text-[#D64933]">TRIBU</span>
          </h1>
          <p className="text-[#B8B0A0] font-mono text-sm mt-2">
            {users.length} développeurs • {posts.length} publications • {users.reduce((acc, u) => acc + u.followers, 0)} followers
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#333]">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-6 py-3 font-mono text-sm tracking-wider transition-all duration-300
              ${activeTab === "feed" 
                ? 'text-[#D64933] border-b-2 border-[#D64933]' 
                : 'text-[#666] hover:text-[#F2E9E2]'
              }`}
          >
            <MessageCircle className="h-4 w-4 inline mr-2" />
            FLUX D'ACTIVITÉ
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`px-6 py-3 font-mono text-sm tracking-wider transition-all duration-300
              ${activeTab === "members" 
                ? 'text-[#D64933] border-b-2 border-[#D64933]' 
                : 'text-[#666] hover:text-[#F2E9E2]'
              }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            MEMBRES
          </button>
        </div>

        {activeTab === "feed" ? (
          <>
            {/* Create Post Button */}
            <div className="mb-6 flex justify-end">
              <Button
                onClick={() => setShowNewPostModal(true)}
                className="bg-[#D64933] hover:bg-[#B33A22] text-[#1A1919] flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                PARTAGER
              </Button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-[#0F0E0E] border-l-4 border-[#D64933] hover:translate-x-1 transition-all duration-300">
                  <div className="p-5">
                    {/* User Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#D64933]/20 border border-[#D64933] flex items-center justify-center">
                          <span className="text-[#D64933] font-mono font-bold">
                            {post.user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <Link href={`/profile/${post.userId}`} className="font-mono font-bold text-[#F2E9E2] hover:text-[#D64933] transition-colors">
                            {post.user.username}
                          </Link>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#666]">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-[#666] hover:text-[#F2E9E2]">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <p className="text-[#B8B0A0] font-mono text-sm mb-4 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Code Snippet */}
                    {post.codeSnippet && (
                      <div className="mb-4 bg-[#1A1919] border border-[#333] p-4 overflow-x-auto">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="h-3 w-3 text-[#D64933]" />
                          <span className="text-[10px] font-mono text-[#D64933]">{post.language}</span>
                        </div>
                        <pre className="text-xs font-mono text-[#6B8C6B] overflow-x-auto">
                          <code>{post.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="text-[9px] font-mono text-[#666] bg-[#1A1919] px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-3 border-t border-[#333]">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 text-sm font-mono transition-all duration-300
                          ${likedPosts.includes(post.id) ? 'text-[#FF6B6B]' : 'text-[#666] hover:text-[#FF6B6B]'}`}
                      >
                        <Heart className={`h-5 w-5 ${likedPosts.includes(post.id) ? 'fill-[#FF6B6B]' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm font-mono text-[#666] hover:text-[#4ECDC4] transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm font-mono text-[#666] hover:text-[#E8C547] transition-colors">
                        <Share2 className="h-5 w-5" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Search Members */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666]" />
                <input
                  type="text"
                  placeholder="Rechercher un membre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0F0E0E] border border-[#333] text-[#F2E9E2] font-mono text-sm px-10 py-3 outline-none focus:border-[#D64933]/50"
                />
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#0F0E0E] border border-[#333] hover:border-[#D64933]/50 transition-all duration-300 overflow-hidden relative"
                >
                  <div className="p-6">
                    {/* Avatar & Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D64933]/20 to-[#D64933]/5 border-2 border-[#D64933] flex items-center justify-center">
                        <span className="text-2xl font-black text-[#D64933]">
                          {member.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Link href={`/profile/${member.id}`} className="text-lg font-bold hover:text-[#D64933] transition-colors">
                          {member.username}
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-[#666] mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{member.location}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFollow(member.id)}
                        className={`px-3 py-1 text-xs font-mono font-bold transition-all duration-300
                          ${followingUsers.includes(member.id)
                            ? 'bg-[#27C93F]/20 text-[#27C93F] border border-[#27C93F]/30'
                            : 'bg-[#D64933] text-[#1A1919] hover:bg-[#B33A22]'
                          }`}
                      >
                        {followingUsers.includes(member.id) ? (
                          <span className="flex items-center gap-1"><Check className="h-3 w-3" /> SUIVI</span>
                        ) : (
                          <span className="flex items-center gap-1"><UserPlus className="h-3 w-3" /> SUIVRE</span>
                        )}
                      </button>
                    </div>

                    {/* Bio */}
                    <p className="text-[#B8B0A0] font-mono text-xs mb-4 line-clamp-2">
                      {member.bio}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-[#333]">
                      <div className="text-center">
                        <div className="text-lg font-black text-[#E8C547]">{member.points}</div>
                        <div className="text-[8px] font-mono text-[#666]">POINTS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-[#4ECDC4]">{member.challengesCompleted}</div>
                        <div className="text-[8px] font-mono text-[#666]">CHALLENGES</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-[#FF6B6B]">{member.streak}</div>
                        <div className="text-[8px] font-mono text-[#666]">STREAK</div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.languages.map((lang, i) => (
                        <span key={i} className="text-[9px] font-mono bg-[#1A1919] text-[#666] px-2 py-0.5 rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3">
                      {member.socialLinks.github && (
                        <a href={`https://github.com/${member.socialLinks.github}`} target="_blank" rel="noopener noreferrer" 
                           className="text-[#666] hover:text-[#F2E9E2] transition-colors">
                          <GithubIcon />
                        </a>
                      )}
                      {member.socialLinks.twitter && (
                        <a href={`https://twitter.com/${member.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer"
                           className="text-[#666] hover:text-[#1DA1F2] transition-colors">
                          <TwitterIcon />
                        </a>
                      )}
                      {member.socialLinks.linkedin && (
                        <a href={`https://linkedin.com/in/${member.socialLinks.linkedin}`} target="_blank" rel="noopener noreferrer"
                           className="text-[#666] hover:text-[#0077B5] transition-colors">
                          <LinkedinIcon />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Hover Stats */}
                  {selectedUser?.id === member.id && (
                    <div className="absolute bottom-0 left-0 right-0 bg-[#D64933]/10 p-3 border-t border-[#D64933]/30 transform translate-y-full transition-transform duration-300"
                         style={{ transform: 'translateY(0)' }}>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {member.followers} followers</span>
                        <span className="flex items-center gap-1"><UserPlus className="h-3 w-3" /> {member.following} following</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* New Post Modal */}
        {showNewPostModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0F0E0E] border-l-4 border-[#D64933] max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black">PARTAGER UNE RÉALISATION</h3>
                  <button onClick={() => setShowNewPostModal(false)} className="text-[#666] hover:text-[#F2E9E2]">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Partage ton challenge, une astuce, ou une réalisation..."
                  className="w-full bg-[#1A1919] border border-[#333] text-[#F2E9E2] font-mono text-sm p-3 outline-none focus:border-[#D64933]/50 min-h-[150px]"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button onClick={() => setShowNewPostModal(false)} variant="outline" className="border-[#333] text-[#666]">
                    ANNULER
                  </Button>
                  <Button onClick={handleCreatePost} className="bg-[#D64933] hover:bg-[#B33A22] text-[#1A1919]">
                    PUBLIER
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
