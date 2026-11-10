# IA Mentor

IA Mentor est une plateforme d’apprentissage pratique pour développeurs. Les membres parcourent des défis, démarrent un parcours, soumettent un dépôt GitHub et reçoivent une analyse automatisée de leur code. Le produit comprend aussi un profil, un classement et des fonctionnalités communautaires.

> **État du dépôt :** l’interface utilise Next.js 16 et React 19 ; l’API utilise Java 21 et Spring Boot 3.4.1. Le fournisseur d’analyse IA actuellement branché est Groq. Les anciennes références à Ollama/Gemma et à Next.js 14 ne décrivent plus l’implémentation actuelle.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation locale](#installation-locale)
- [Configuration](#configuration)
- [Parcours d’une soumission](#parcours-dune-soumission)
- [API](#api)
- [Tests](#tests)
- [Structure](#structure)
- [Limitations et sécurité](#limitations-et-sécurité)
- [Contribution](#contribution)

## Fonctionnalités

- Catalogue de défis consultable par catégorie, niveau et type, avec pages de détails.
- Démarrage d’un défi, soumission d’une URL GitHub et historique personnel.
- Analyse asynchrone du dépôt par Groq avec résumé, note, points forts, faiblesses, suggestions et métriques.
- Profil, points et classement.
- Communauté : posts, tendances, suggestions, abonnements, likes et commentaires.
- Administration des défis, catégories et soumissions selon les autorisations du backend.
- Authentification par inscription/connexion, JWT et refresh token ; OAuth2 GitHub est également configuré.

Les statistiques ou exemples de la page d’accueil peuvent être illustratifs : ils ne garantissent pas le contenu de la base.

## Architecture

~~~text
Navigateur
   │
   ▼
Frontend Next.js ── REST/JSON ──► API Spring Boot
                                      ├── Spring Security, JWT, OAuth2
                                      ├── Services métier et Spring Data JPA
                                      ├── PostgreSQL
                                      ├── GitHub REST API (lecture des dépôts)
                                      └── Traitement asynchrone ──► Groq API
~~~

Le backend sépare contrôleurs, services, repositories, entités et DTO. Le frontend utilise l’App Router de Next.js, des composants et hooks réutilisables, des clients API dans frontend/lib et Zustand pour l’état d’authentification.

## Technologies

| Partie | Technologies déclarées |
|---|---|
| Backend | Java 21, Spring Boot 3.4.1, Spring Web, Spring Security, Spring Data JPA, PostgreSQL, Lombok, JJWT |
| IA | API Groq compatible avec les complétions de chat |
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Axios, Zustand, Framer Motion, Lucide |
| Tests | Spring Boot Test/JUnit et H2 ; Jest, Testing Library et ts-jest |
| Build/déploiement | Maven Wrapper, npm, Vercel frontend, Railpack backend |

Ces versions proviennent de backend/pom.xml et frontend/package.json et peuvent évoluer.

## Prérequis

- JDK 21
- Node.js et npm compatibles avec Next.js 16
- PostgreSQL
- Une clé API Groq pour les analyses
- Credentials OAuth GitHub si cette méthode de connexion est utilisée

## Installation locale

### Base PostgreSQL

Exemple avec Docker :

~~~bash
docker run --name ia-mentor-postgres -e POSTGRES_DB=ai_mentor_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=change-me -p 5432:5432 -d postgres:16
~~~

Adaptez les identifiants à votre environnement. Le dépôt ne fournit pas de Docker Compose.

### Backend

Créez backend/.env localement avec les propriétés adaptées :

~~~dotenv
spring.datasource.url=jdbc:postgresql://localhost:5432/ai_mentor_db
spring.datasource.username=postgres
spring.datasource.password=change-me
spring.jpa.hibernate.ddl-auto=update

application.security.jwt.secret-key=replace-with-a-long-random-secret
application.security.jwt.expiration=900000
application.security.jwt.refresh-expiration=7776000000

spring.security.oauth2.client.registration.github.client-id=your-github-client-id
spring.security.oauth2.client.registration.github.client-secret=your-github-client-secret
spring.security.oauth2.client.registration.github.scope=read:user,user:email

ai.api.url=https://openrouter.ai/api/v1/chat/completions
ai.api.key=your-openrouter-api-key
ai.models=cohere/north-mini-code:free,google/gemma-4-31b-it:free
github.api.token=
~~~

L’application charge ce fichier avec dotenv-java (et continue à démarrer s’il est absent). Les valeurs ci-dessus sont des exemples ; ne commitez jamais de clés ou secrets réels. La clé OpenRouter se place dans OPENROUTER_API_KEY ; les identifiants de modèles gratuits se terminent par ":free" et peuvent changer avec le temps.

Démarrez depuis backend :

~~~bash
./mvnw spring-boot:run
~~~

Sous Windows :

~~~powershell
.\mvnw.cmd spring-boot:run
~~~

Le serveur écoute par défaut sur http://localhost:8080.

### Frontend

Créez frontend/.env.local :

~~~dotenv
NEXT_PUBLIC_API_URL=http://localhost:8080
~~~

Depuis frontend :

~~~bash
npm install
npm run dev
~~~

Ouvrez http://localhost:3000. Le backend et le frontend doivent tourner dans des terminaux distincts.

## Configuration

La configuration Spring se trouve dans backend/src/main/resources/application.properties. Principaux paramètres :

- spring.datasource.* : connexion PostgreSQL.
- spring.jpa.hibernate.ddl-auto : stratégie de schéma.
- application.security.jwt.* : clé et durées JWT.
- spring.security.oauth2.client.registration.github.* : OAuth GitHub.
- ai.api.url, ai.api.key, ai.models, ai.max.tokens : service IA (OpenRouter, modèles gratuits).
- github.api.token : jeton optionnel pour les appels GitHub.

Le client frontend lit NEXT_PUBLIC_API_URL et retombe sur http://localhost:8080. Les variables NEXT_PUBLIC_* sont publiques une fois intégrées au navigateur : aucun secret ne doit y être placé.

Dans le code inspecté, CORS n’autorise que http://localhost:3000 et le callback OAuth redirige vers http://localhost:3000/oauth2/callback. Adaptez ces réglages avant tout déploiement hors local.

## Parcours d’une soumission

1. Le membre consulte les défis puis démarre un défi avec son identifiant.
2. Il envoie l’identifiant du défi et l’URL du dépôt GitHub.
3. Le backend enregistre la soumission et lance l’analyse en arrière-plan.
4. GitHubService utilise l’API GitHub pour explorer le dépôt et lire les fichiers.
5. Le service filtre les extensions prises en charge, ignore certains répertoires générés, limite la profondeur à 6 niveaux et ignore les fichiers de plus de 500 Ko.
6. GroqService envoie le code sélectionné et le contexte du défi à Groq, avec une logique de tentatives.
7. Le rapport est sauvegardé dans l’analyse et la soumission. En cas de succès, la soumission devient REVIEWED et les points du défi sont crédités lorsque les conditions métier sont satisfaites.
8. Le frontend consulte le résultat et affiche le feedback.

Les états d’analyse incluent PENDING, FETCHING, ANALYZING, COMPLETED et FAILED. Le contenu du dépôt est transmis au fournisseur Groq configuré ; l’analyse n’est pas locale. Vérifiez que vous avez le droit de transmettre le code concerné à ce service.

## API

Préfixe général : /api. Les contrôleurs définissent les chemins et permissions exacts. Les principales familles observées sont :

| Domaine | Routes représentatives | Accès |
|---|---|---|
| Authentification | /api/auth/register, /login, /refresh, /logout | Routes de session |
| Profil | /api/users/profile | Authentifié |
| Défis | /api/challenges, /api/challenges/{slug} | Lecture publique, mutations admin |
| Catégories | /api/categories, /api/categories/{slug} | Lecture publique, mutations admin |
| Soumissions | /api/submissions/start, /submit, /user/me, /user/me/in-progress, /user/me/completed | Utilisateur authentifié |
| Analyse | /api/analysis/submission, /api/analysis/submission/{id}, /repository | Utilisateur authentifié |
| Administration | /api/admin/submissions et /{id}/analyze | Administrateur |
| Classement | /api/leaderboard et /me | Utilisateur authentifié |
| Communauté | /api/social/... | Flux public, autres opérations protégées selon la route |
| Diagnostic IA | /api/groq/test, /api/groq/diagnose | Authentifié ; diagnostic complet admin |

Démarrer un défi :

~~~http
POST /api/submissions/start
Content-Type: application/json
Authorization: Bearer <access-token>

{"challengeId": 1}
~~~

Soumettre un dépôt :

~~~http
POST /api/submissions/submit
Content-Type: application/json
Authorization: Bearer <access-token>

{"challengeId": 1, "githubUrl": "https://github.com/owner/repository"}
~~~

Les réponses de nombreuses routes sont enveloppées dans un objet contenant success, data et parfois message.

## Tests

Les tests backend sont sous backend/src/test/java et utilisent H2 en mémoire :

~~~bash
cd backend
./mvnw test
~~~

Sous Windows, utilisez .\mvnw.cmd test.

Le frontend comprend un test Jest sous frontend/__tests__ :

~~~bash
cd frontend
npm test
npm run lint
npm run build
~~~

Les tests locaux ne remplacent pas la vérification des intégrations Groq, GitHub OAuth ou PostgreSQL réel.

## Structure

~~~text
.
├── AGENTS.md
├── README.md
├── backend/
│   ├── pom.xml
│   ├── railpack.toml
│   └── src/
│       ├── main/java/com/djenidi/ai_mentor/
│       │   ├── controller/ config/ dto/ entity/
│       │   ├── exception/ prompt/ repository/
│       │   ├── security/ service/
│       └── test/
└── frontend/
    ├── app/ components/ docs/ hooks/ lib/ public/ types/
    ├── __tests__/
    ├── package.json
    └── vercel.json
~~~

## Limitations et sécurité

- L’ancien README citait Ollama/Gemma, une analyse locale, le clonage Git, Next.js 14 et React 18 : ces informations sont obsolètes au regard du code et fichiers de build observés.
- GitHubService lit les dépôts par l’API GitHub. L’accès aux dépôts privés dépend du jeton et de ses permissions.
- La configuration locale CORS/OAuth doit être adaptée avant mise en production.
- Ne publiez pas application.properties ou .env avec des valeurs sensibles. Si un vrai secret a déjà été commité, révoquez-le et remplacez-le.
- Le dépôt ne déclare pas de dépendance OpenAPI/Swagger dans le pom.xml actuellement observé ; ne supposez pas qu’une interface Swagger est disponible.

## Contribution

Consultez AGENTS.md et les instructions locales avant de modifier le code. Pour le frontend, frontend/AGENTS.md demande de lire la documentation Next.js installée sous node_modules/next/dist/docs/ avant tout changement frontend.

1. Créez une branche dédiée.
2. Faites un changement ciblé et adaptez les tests pertinents.
3. Lancez les vérifications adaptées au module.
4. Dans la pull request, décrivez le problème, la solution et les vérifications effectuées.

---
Dernière mise à jour : 28 octobre 2026.
