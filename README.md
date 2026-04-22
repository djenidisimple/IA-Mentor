# 🚀 IA Mentor - AI Powered Learning Platform

**IA Mentor** est une plateforme d'apprentissage destinée aux développeurs souhaitant se perfectionner sur des projets **Fullstack** et **Backend**. Elle utilise l'**Intelligence Artificielle (Ollama - Gemma2:2b)** pour valider automatiquement les soumissions des utilisateurs en analysant leur code source via GitHub.

## 📊 État du Projet (April 2026)

✅ **Production Ready** - Backend + Frontend compilés et testés
- Backend: Java 21 + Spring Boot 3.4.1 ✓
- Frontend: Next.js 14 + React 18 ✓
- **Ollama (Gemma2:2b) AI Integration: Opérationnel ✓** (migré de Gemini)
- Async Analysis Processing: Implémenté ✓
- Database Sync: Actif ✓

---

## 📋 Table des Matières

* [Vision du Projet](#-vision-du-projet)
* [Fonctionnalités Clés](#-fonctionnalités-clés)
* [Architecture Technique](#-architecture-technique)
* [Stack Technologique](#-stack-technologique)
* [Quick Start](#-quick-start)
* [Installation Détaillée](#-installation-détaillée)
* [Dépannage](#-dépannage)
* [Roadmap](#-roadmap)

---

## 🎯 Vision du Projet

Combler le fossé entre les tutoriels théoriques et la pratique réelle. IA Mentor se concentre sur :

* **Logique métier** : APIs RESTful, Architecture, Bonnes Pratiques
* **Gestion des bases de données** : Modélisation, Optimisation
* **Qualité du code** : Analyse sémantique, Recommandations personnalisées
* **Feedback automatisé** : Génération de rapports via IA locale (Ollama)

---

## ✨ Fonctionnalités Clés

### 1. 📚 Catalogue de Projets
- Énoncés détaillés classés par difficulté (Junior, Intermédiaire, Expert)
- Spécifications techniques et contraintes
- Critères d'évaluation clairs

### 2. 🔗 Soumission par GitHub
- L'utilisateur soumet le lien de son repository (public)
- Clonage automatique du dépôt
- Pas de fichiers à uploader

### 3. 🤖 Analyse Intelligente (Ollama - Gemma2:2b-CPU)
- **Async Processing** : Analyse en arrière-plan sans bloquer l'UI
- **Code Analysis** : Analyse sémantique complète du code
- **Real-time Polling** : Frontend met à jour le résultat toutes les 3 secondes
- **Synchronized Storage** : Résultats sauvegardés en base de données
- **Local Execution** : Pas de dépendance à une API cloud

### 4. 📊 Rapport Automatisé
- **Score global** : Évaluation sur 100
- **Strengths** : Points forts identifiés
- **Weaknesses** : Domaines à améliorer
- **Suggestions** : Recommandations concrètes
- **Code Quality Metrics** : Métriques détaillées

---

## 🏗 Architecture Technique

### Backend (Java/Spring Boot)

```
Controller (REST API)
    ↓
Service Layer (Business Logic)
    ├─ SubmissionService (Gestion des soumissions)
    ├─ AnalysisService (Orchestration de l'analyse)
    ├─ OllamaService (Appels API Ollama avec retry logic)
    └─ GitHubService (Clonage et lecture de dépôts)
    ↓
Repository (JPA/Hibernate)
    ↓
PostgreSQL Database
```

### Frontend (Next.js/React)

```
Layout Components
    ├─ ChallengeStepLayout (Orchestrateur du flux)
    ├─ ChallengeSubmissionForm (Soumission GitHub)
    └─ ChallengeAIFeedback (Affichage du feedback)
    ↓
Custom Hooks & API Client
    ├─ submissionsApi
    ├─ analysisApi
    └─ challengesApi
    ↓
State Management (Zustand + React Hooks)
    ↓
Tailwind CSS + Lucide Icons
```

### Flux de Données (End-to-End)

```
1. User submits GitHub URL
   ↓
2. ChallengeSubmissionForm → POST /api/submissions/submit
   ↓
3. Backend creates Submission (status: SUBMITTED)
   ↓
4. AnalysisService.analyzeSubmission() 
   └─ @Async triggerAsyncAnalysis()
   ↓
5. GitHubService clones repository
   ↓
6. OllamaService analyzes code (with retry logic: 3 attempts)
   ↓
7. Results saved to Analysis + Submission entities (sync)
   ↓
8. Frontend polls /api/analysis/submission/{id} every 3s
   ↓
9. ChallengeAIFeedback displays results
```

---

## 🛠 Stack Technologique

### Backend
- **Java 21 LTS** - Runtime
- **Spring Boot 3.4.1** - Framework Web
- **Spring Data JPA** - ORM
- **Hibernate 6.6.4** - Entity Management
- **Spring Security** - Authentication/Authorization
- **JWT** - Token-based Auth
- **PostgreSQL 18** - Base de données
- **RestTemplate** - HTTP Client pour Ollama API
- **Lombok** - Réduction du boilerplate
- **SLF4J + LogBack** - Logging

### Frontend
- **Next.js 14** - React Framework
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **Lucide Icons** - Icon Library
- **Axios** - HTTP Client (wrappé par apiFetch)

### AI/External Services
- **Ollama (Gemma2:2b-CPU)** - Code Analysis (Local)
- **GitHub API** - Repository Access

### DevOps
- **Docker** - Containerization (optionnel)
- **PostgreSQL Docker** - Development Database
- **Maven** - Build Tool (Java)
- **npm** - Package Manager (Node.js)

---

## 🚀 Quick Start

### Prérequis
- JDK 21+
- Node.js 18+
- PostgreSQL 15+
- Ollama + Gemma2:2b (gratuit)

### 0️⃣ Setup Ollama
```bash
# Installer Ollama depuis https://ollama.ai
ollama serve

# Dans un autre terminal, télécharger le modèle
ollama pull gemma2:2b

# Vérifier que le modèle est prêt
curl http://localhost:11434/api/tags
```

### 1️⃣ Setup Backend
```bash
cd backend

# Configure .env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ai_mentor_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b

# Build & Run
mvn clean install
mvn spring-boot:run
# Backend ready on http://localhost:8080
```

### 2️⃣ Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Configure .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080

# Run development server
npm run dev
# Frontend ready on http://localhost:3000
```

### 3️⃣ Enjoy!
- Open http://localhost:3000
- Create a test account
- Submit a GitHub repository
- Get instant AI feedback 🎉

---

## ⚙️ Installation Détaillée

### Étape 1 : Configuration Base de Données

```bash
# Avec Docker (recommandé)
docker run --name postgres-ai-mentor \
  -e POSTGRES_DB=ai_mentor_db \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  -d postgres:15

# Ou installez PostgreSQL localement
# psql -U postgres
# CREATE DATABASE ai_mentor_db;
```

### Étape 2 : Configuration Ollama

1. Installez Ollama depuis https://ollama.ai
2. Lancez le serveur:
   ```bash
   ollama serve
   ```
3. Téléchargez le modèle Gemma2:
   ```bash
   ollama pull gemma2:2b
   ```
4. Vérifiez que le serveur est en cours d'exécution:
   ```bash
   curl http://localhost:11434/api/tags
   ```

### Étape 3 : Variables d'environnement

**Backend (`backend/.env`)**
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ai_mentor_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DDL_AUTO=update
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b
GITHUB_TOKEN=your_github_token_optional
```

**Frontend (`frontend/.env.local`)**
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=IA Mentor
```

### Étape 4 : Lancer l'Application

**Terminal 1 - Ollama**
```bash
ollama serve
# Ollama listening on 127.0.0.1:11434
```

**Terminal 2 - Backend**
```bash
cd backend
mvn spring-boot:run
# Logs avec emojis 🔍📁📝✅ pour tracking Ollama
```

**Terminal 3 - Frontend**
```bash
cd frontend
npm run dev
# Hot reload activé
```

**Terminal 4 - Optionnel (Database)**
```bash
docker exec -it postgres-ai-mentor psql -U postgres -d ai_mentor_db
# Pour inspecter la base de données
```

---

## 🧪 Tester la Configuration

```bash
# Test public (pas d'auth requise)
curl http://localhost:8080/api/ollama/test

# Test admin
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/ollama/diagnose
```

**Réponse attendue:**
```json
{
  "serviceAvailable": true,
  "connectionSuccessful": true,
  "modelAvailable": true,
  "testMessage": "✅ Simple test successful - Ollama (Gemma2) is working | ✅ JSON parsing OK"
}
```

---

## 🐛 Dépannage

### Backend ne démarre pas
```bash
# Port 8080 déjà utilisé ?
netstat -ano | findstr :8080
# Puis tuer le processus
Stop-Process -Id <PID> -Force

# Ou changer le port dans application.properties
server.port=8081
```

### Erreur Ollama "Analysis failed"
- Vérifiez que le serveur Ollama est lancé: `ollama serve`
- Vérifiez que le modèle est téléchargé: `ollama pull gemma2:2b`
- Vérifiez la connexion: `curl http://localhost:11434/api/tags`
- Vérifiez les logs backend avec les emojis 🌐📤❌:
  - 🔍 Démarrage analyse Ollama
  - 🌐 Appel de l'API Ollama
  - 📤 Envoi de la requête
  - ✅ Réponse reçue (ou ❌ Erreur)

### Frontend ne se connecte pas au backend
```bash
# Vérifier CORS dans application.properties
cors.allowed-origins=http://localhost:3000

# Vérifier NEXT_PUBLIC_API_URL
echo $NEXT_PUBLIC_API_URL  # Doit être http://localhost:8080
```

### Database connection refused
```bash
# Vérifier PostgreSQL
psql -U postgres -d ai_mentor_db

# Ou relancer Docker
docker start postgres-ai-mentor
```



---

## 🗺 Roadmap

### Phase 1: MVP ✅ COMPLETED
- [x] Backend: Java 21 + Spring Boot
- [x] Frontend: Next.js + React + TypeScript
- [x] Database: PostgreSQL avec JPA
- [x] Authentication: JWT-based
- [x] Ollama (Gemma2:2b) AI Integration
- [x] Async Analysis Processing
- [x] Real-time Polling (Frontend)
- [x] Submission + Analysis Sync

### Phase 2: Enhanced Features (In Progress)
- [ ] Advanced Code Metrics (Cyclomatic Complexity, etc.)
- [ ] Performance Benchmarking
- [ ] Leaderboard System
- [ ] Challenge Categories & Difficulty
- [ ] Admin Dashboard
- [ ] User Progress Tracking

### Phase 3: Production Ready
- [ ] Docker Compose Setup
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Security Audit
- [ ] Load Testing
- [ ] Monitoring & Alerting (New Relic/DataDog)
- [ ] API Rate Limiting
- [ ] WebSocket for Real-time Updates

### Phase 4: Community Features
- [ ] Community Challenges
- [ ] Solution Sharing
- [ ] Code Reviews
- [ ] Discussion Forums
- [ ] Badges & Achievements

---

## 📁 Project Structure

```
d:\IA-Mentor
├── backend/                          # Java Spring Boot
│   ├── src/main/java/
│   │   └── com/djenidi/ai_mentor/
│   │       ├── controller/           # REST Endpoints
│   │       ├── service/              # Business Logic
│   │       │   ├── SubmissionService
│   │       │   ├── AnalysisService
│   │       │   ├── OllamaService     # Ollama (Gemma2) API
│   │       │   └── GitHubService
│   │       ├── repository/           # JPA Repositories
│   │       ├── entity/               # Database Models
│   │       └── config/               # Spring Config
│   ├── pom.xml                       # Maven Config
│   └── .env                          # Environment Variables
│
├── frontend/                         # Next.js React
│   ├── app/
│   │   ├── (auth)/                   # Authentication pages
│   │   ├── (dashboard)/              # Main app pages
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── challenges/               # Challenge UI
│   │   ├── layout/                   # Layout components
│   │   └── ui/                       # Reusable components
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   ├── submissions.ts
│   │   ├── analysis.ts
│   │   └── store/                    # Zustand stores
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── challenge.types.ts
│   │   └── submission.types.ts
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md                         # This file
```

---

## 🔑 Key Features Implemented

### ✅ Authentication & Authorization
- JWT-based token authentication
- Role-based access control (USER, ADMIN)
- Secure password hashing
- Session persistence

### ✅ Submission Management
- GitHub repository URL submission
- Automatic status tracking (IN_PROGRESS → SUBMITTED → REVIEWED)
- Real-time submission history
- User-specific submission isolation

### ✅ AI Analysis Engine
- **Async Processing**: @Async annotations pour non-blocking analysis
- **Retry Logic**: 3 attempts with exponential backoff
- **Error Handling**: Graceful fallback et error messages
- **Real-time Feedback**: Polling-based frontend updates
- **Data Sync**: Analysis results synced to Submission entity

### ✅ GitHub Integration
- Automatic repository cloning
- Support for public and private repos
- Source code extraction
- File type filtering

### ✅ Frontend Polish
- Responsive Tailwind CSS design
- Real-time loading states
- Error boundaries
- Type-safe TypeScript

---

## 🤝 Contributing

Les contributions sont bienvenues! Pour contribuer:

1. **Fork** le projet
2. **Créez une branche** (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add amazing feature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez une Pull Request**

### Code Standards
- Formatage: Prettier + ESLint (Frontend)
- Tests: JUnit 5 + MockMvc (Backend)
- Commits: Conventional Commits
- Documentation: JSDoc + JavaDoc

---

## 📄 License

Ce projet est sous licence **MIT**. Voir [LICENSE](LICENSE) pour plus de détails.

---

## 📧 Support

Pour toute question ou problème:
- 📧 Email: support@iamentor.dev
- 🐛 Issues: [GitHub Issues](https://github.com/djenidi/ia-mentor/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/djenidi/ia-mentor/discussions)

---

**Last Updated**: April 20, 2026
**Status**: 🟢 Production Ready
Ce projet est **Open Source** ! Les contributions de toutes sortes sont les bienvenues :
* 🐛 **Signaler des bugs :** Ouvrez une "Issue" pour expliquer le problème.
* ✨ **Proposer des fonctionnalités :** Vous avez une idée pour l'analyse IA ? Partagez-la !
* 📝 **Documentation :** Améliorer ce README ou les commentaires du code.

### Comment contribuer ?
1. Forkez le projet.
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`).
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`).
4. Pushez sur la branche (`git push origin feature/AmazingFeature`).
5. Ouvrez une **Pull Request**.