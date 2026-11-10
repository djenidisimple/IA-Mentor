# IA Mentor — guide de contexte pour les agents

## Mission et produit

IA Mentor est une plateforme d’apprentissage pratique pour développeurs. Elle propose des défis de programmation, permet de démarrer un défi et de soumettre un dépôt GitHub, puis fait analyser le dépôt par une IA qui produit une note et des commentaires. Le produit comprend également profils, suivi des soumissions, classement et communauté.

Ce guide décrit le dépôt observé. Le code actuel est la référence du comportement ; certains passages du README sont historiques.

## Architecture

- backend/ : API REST Java 21 et Spring Boot 3.4.1, logique métier, persistance, sécurité et intégrations.
- frontend/ : application Next.js App Router, React, TypeScript et Tailwind CSS.
- README.md : documentation générale qui diverge de l’implémentation sur plusieurs points.

Flux principal : démarrage du défi → soumission d’une URL GitHub → récupération des fichiers → analyse IA asynchrone contextualisée par le défi → sauvegarde du rapport → affichage au membre.

## Fonctionnalités présentes dans le code

- Inscription, connexion, JWT, renouvellement, déconnexion et OAuth2 GitHub.
- Catalogue de défis et catégories, détails et opérations d’administration.
- Démarrage, soumission GitHub, historique, défis en cours et terminés.
- Rapport IA : résumé, feedback détaillé, note, points forts, faiblesses, suggestions et métriques.
- Récupération et affichage du contenu d’un dépôt, endpoints de diagnostic IA.
- Profil, points et classement.
- Communauté : posts, tendances, suggestions, suivi, likes et commentaires.
- Administration des soumissions et relance d’analyse.

Les éléments de marketing, exemples chiffrés et liens de la landing page ne prouvent pas que des données/routes correspondantes existent. Vérifier le code avant d’annoncer une fonctionnalité.

## Backend

Le package Java racine est com.djenidi.ai_mentor sous backend/src/main/java/.

- controller/ : Auth, User, Challenge, Category, Submission, Analysis, AdminSubmission, Groq, Leaderboard et Social.
- service/ : règles métier, dont AuthService, SubmissionService, AnalysisService, GitHubService, GroqService et SocialService.
- repository/ : accès Spring Data JPA.
- entity/ : modèles persistés et enums de rôle, état, niveau et type.
- dto/ : objets de requête/réponse.
- security/ et config/ : JWT, OAuth2, filtres, sécurité, CORS et exécution asynchrone.
- prompt/ : modèles des consignes IA.
- exception/ : erreurs métier et gestion globale.

Familles de routes observées : /api/auth, /api/users, /api/challenges, /api/categories, /api/submissions, /api/analysis, /api/admin/submissions, /api/groq, /api/leaderboard, /api/social. Les contrôleurs sont la référence pour les méthodes et chemins exacts.

SecurityConfig rend publiques l’inscription, connexion, renouvellement, OAuth2, lectures des défis/catégories et lecture du flux public. Le reste nécessite une authentification, complétée pour certaines méthodes par @PreAuthorize. L’API est sans session, utilise un filtre JWT et BCrypt. Le CORS lu autorise http://localhost:3000 avec credentials ; vérifier pour chaque environnement.

### Analyse IA

AnalysisService crée ou réutilise Analysis, puis démarre triggerAsyncAnalysis avec @Async("asyncExecutor"), après commit si une transaction est active. AIConfig configure 2 threads de base, 5 maximum, file de 10.

États d’analyse observés : PENDING, FETCHING, ANALYZING, puis COMPLETED ou FAILED. En succès, les résultats sont enregistrés, la Submission passe à REVIEWED, et les points du défi sont crédités. Lire AnalysisService avant de modifier les transitions ou la gestion d’erreur.

Le fournisseur injecté est OpenRouterService via @Qualifier("openRouterService"). OpenRouterService utilise l’API OpenRouter (chat completions compatible OpenAI), avec URL, liste ordonnée de modèles et clé configurables (ai.api.url, ai.models, ai.api.key issue de OPENROUTER_API_KEY). Les modèles gratuits portent le suffixe ":free" ; le premier modèle configuré est utilisé et les suivants servent de repli. AIService définit le résultat commun. Les contrôleurs et routes historiques /api/groq sont conservés. Le README décrivant Ollama/Gemma est obsolète pour le code inspecté. Ne jamais exposer de secrets dans le dépôt, les logs, les réponses ou la documentation.

### Données et build backend

Les entités sont gérées par JPA/Hibernate. Le runtime vise PostgreSQL selon application.properties ; les tests utilisent H2 en mémoire. Lire les propriétés actuelles avant d’altérer schéma ou configuration. Le code/config est la référence pour les noms de paramètres : ne pas supposer que le fichier .env du README est automatiquement chargé.

Dépendances du pom.xml : Spring Web, Data JPA, Security, OAuth2 client/resource server, Validation, PostgreSQL, H2 de test, JJWT, dotenv-java et Lombok. Maven Wrapper présent : backend/mvnw et backend/mvnw.cmd. Déploiement décrit par backend/railpack.toml.

Les paramètres sensibles/configurables incluent datasource, secrets JWT, credentials OAuth GitHub, clé, URL et modèle Groq. Utiliser des variables/valeurs factices dans la documentation.

## Frontend

Routes sous frontend/app/ :

- Public : accueil, register, login, profil et callback OAuth.
- Dashboard : home, dashboard, challenges et détail par slug, community, détail communauté, leaderboard et admin/submissions.

Répertoires principaux : components/challenges (parcours et composants de défi), components/submissions, components/providers, components/ui, hooks, lib et types. lib/ contient les clients API, modules métier et store Zustand d’authentification. Réutiliser les types et clients existants plutôt que dupliquer les appels HTTP. Vérifier quel client gère JWT/refresh avant d’introduire un nouveau mécanisme.

Versions actuelles du package.json : Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Axios, Zustand, Framer Motion et Lucide. Commandes depuis frontend/ : npm run dev, npm run build, npm start, npm run lint, npm test. L’URL API est généralement pilotée par NEXT_PUBLIC_API_URL ; consulter les clients pour la valeur de repli et le préfixe exact.

La consigne frontend/AGENTS.md s’applique aux changements frontend : consulter la documentation Next.js locale dans node_modules/next/dist/docs/ avant d’écrire du code et respecter les conventions de la version installée.

## Tests et vérifications

Tests backend présents dans backend/src/test/java : test de contexte et test du contrôleur admin de soumissions. Configuration de test dans backend/src/test/resources/application.properties. Test frontend présent : frontend/__tests__/AdminSubmissions.test.tsx, configuré par jest.config.cjs et jest.setup.ts.

Pour chaque changement, lancer les vérifications ciblées pertinentes lorsque demandé ou nécessaire et rapporter exactement les commandes exécutées et leurs résultats. Ne pas prétendre qu’un build/test/lint est passé sans l’avoir exécuté. Les intégrations Groq, GitHub OAuth et PostgreSQL peuvent nécessiter une configuration externe.

## Règles de travail pour les agents

1. Lire le code du module et les consignes applicables avant de modifier.
2. Maintenir la séparation contrôleur/service/repository/DTO au backend et composants/hooks/lib/types au frontend.
3. Pour un changement API, vérifier contrôleur, DTO, client frontend, type et affichage.
4. Conserver la cohérence des transitions d’état, de la propriété des données et des autorisations. Une route doit avoir un contrôle serveur explicite ; masquer un bouton n’est pas une autorisation.
5. Valider prudemment les URL externes et ne pas divulguer les données privées, jetons ou contenus de dépôts dans les logs.
6. Ne pas ajouter de secret réel. Documenter les noms de paramètres avec exemples fictifs seulement.
7. Limiter les changements à l’objectif demandé ; éviter le reformatage massif.
8. Distinguer dans la documentation les comportements confirmés, les paramètres attendus et les idées de roadmap.
9. Répondre en français si l’utilisateur s’exprime en français, avec résumé des fichiers modifiés et vérifications effectuées.

## Divergences connues et prudence documentaire

- README racine : Ollama/Gemma2, Next 14/React 18 et certaines descriptions de polling. Code actuel : GroqService, Spring Boot 3.4.1/Java 21, Next 16/React 19. Privilégier le code et les fichiers de build.
- Ne pas qualifier l’analyse de locale/Ollama sans modification effective de l’implémentation.
- application.properties contient des valeurs de configuration : ne pas les recopier dans ce guide ; examiner leur statut et l’usage de secrets séparément.
- Ne pas supposer que toutes les routes et fonctionnalités des anciens documents existent encore : vérifier les contrôleurs.
