-- =============================================================================
-- IA Mentor — Réinitialisation des données d'exercices + réinsertion des défis
-- =============================================================================
-- Objectif :
--   1. Effacer toutes les données d'activité (soumissions, analyses, notes,
--      likes, commentaires, notifications, abonnements, sessions).
--   2. Réinsérer le catalogue de défis résolvables (catégories + défis +
--      technologies + critères d'évaluation IA).
--
-- Les comptes utilisateurs sont CONSERVÉS afin de pouvoir se reconnecter.
-- Pour repartir aussi de zéro côté comptes, voir la section optionnelle en fin
-- de fichier.
--
-- Exécution :
--   psql -h localhost -U postgres -d ai_mentor_db -f backend/db/seed/challenges_seed.sql
--
-- Le script est idempotent : il peut être rejoué autant de fois que nécessaire.
-- =============================================================================

BEGIN;

-- 1. Données d'activité (ordre compatible avec les clés étrangères) -----------
DELETE FROM submission_likes;
DELETE FROM analyses;
DELETE FROM comments;
DELETE FROM submissions;
DELETE FROM notifications;
DELETE FROM subscriptions;
DELETE FROM user_follows;
DELETE FROM auth_sessions;
DELETE FROM refresh_tokens;   -- table héritée, plus utilisée par le code

-- 2. Catalogue des défis ------------------------------------------------------
DELETE FROM challenge_criteres_ia;
DELETE FROM challenge_technologies;
DELETE FROM challenges;
DELETE FROM categories;

-- 3. Catégories ---------------------------------------------------------------
INSERT INTO public.categories (id, created_at, description, name, slug, updated_at) VALUES (1, '2026-11-10 16:33:23.73716', 'Conception, sécurisation et exposition d''API REST prêtes pour la production.', 'API & Backend', 'api-backend', '2026-11-10 21:12:54.725898');
INSERT INTO public.categories (id, created_at, description, name, slug, updated_at) VALUES (2, '2026-11-10 16:33:23.872187', 'Applications complètes, du frontend jusqu''à la base de données.', 'Fullstack', 'fullstack', '2026-11-10 21:12:54.725898');
INSERT INTO public.categories (id, created_at, description, name, slug, updated_at) VALUES (3, '2026-11-10 16:33:23.936225', 'Modélisation relationnelle, requêtes SQL et performance.', 'Bases de données', 'base-de-donnes', '2026-11-10 21:12:54.725898');
INSERT INTO public.categories (id, created_at, description, name, slug, updated_at) VALUES (4, '2026-11-10 16:33:23.990772', 'Tests automatisés, intégration continue et qualité logicielle.', 'Qualité & Tests', 'qualit-tests', '2026-11-10 21:12:54.725898');
INSERT INTO public.categories (id, created_at, description, name, slug, updated_at) VALUES (9, '2026-08-12 21:05:28.93929', 'Authentification, autorisation et durcissement des applications.', 'Sécurité', 'securite', '2026-11-10 21:12:54.725898');
INSERT INTO public.categories (id, created_at, description, name, slug, updated_at) VALUES (10, '2026-08-12 21:05:28.93929', 'Caching, montée en charge et conception de systèmes distribués.', 'Architecture', 'architecture', '2026-11-10 21:12:54.725898');

-- 4. Défis --------------------------------------------------------------------
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (21, '2026-09-01 21:12:54.725898', 'Vous devez concevoir une API REST complète pour gérer des tâches : création, lecture, mise à jour, suppression et filtrage par statut. Le projet impose une architecture en couches (contrôleur, service, repository), une validation stricte des entrées et des codes HTTP conformes aux conventions REST. Les erreurs sont centralisées dans un gestionnaire global et chaque endpoint doit rester testable indépendamment de la base.', false, 'DEBUTANT', 100, true, 'api-rest-gestion-taches', 'API REST de gestion de tâches', 'BACKEND', '2026-09-01 21:12:54.725898', 1);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (22, '2026-09-04 21:12:54.725898', 'Implémentez une authentification complète : inscription, connexion, jeton d''accès signé, refresh token en cookie httpOnly et déconnexion. Les mots de passe sont hachés avec BCrypt, les endpoints sensibles protégés par rôle et l''expiration des jetons gérée explicitement. L''évaluation porte sur la robustesse du flux, la rotation des refresh tokens et l''absence de données sensibles dans les réponses ou les logs.', false, 'INTERMEDIAIRE', 250, true, 'authentification-jwt-securisee', 'Authentification JWT sécurisée', 'BACKEND', '2026-09-04 21:12:54.725898', 1);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (23, '2026-09-07 21:12:54.725898', 'Construisez un tableau de bord qui affiche des indicateurs mis à jour en direct : commandes du jour, chiffre d''affaires et activité récente. Le backend expose les agrégats et pousse les mises à jour, le frontend les affiche sans rechargement de page. Vous devez gérer la reconnexion, les états de chargement et les valeurs vides sans bloquer l''interface.', false, 'AVANCE', 400, true, 'tableau-de-bord-temps-reel', 'Tableau de bord temps réel', 'FULLSTACK', '2026-09-07 21:12:54.725898', 2);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (24, '2026-09-10 21:12:54.725898', 'Ajoutez la pagination, le tri et des filtres combinables à un catalogue volumineux sans dégrader les temps de réponse. Les requêtes sont construites côté base plutôt que filtrées en mémoire, avec les index adaptés et une pagination stable même quand les données changent. Les mesures doivent montrer un temps de réponse quasi constant lorsque le volume augmente.', false, 'INTERMEDIAIRE', 200, true, 'pagination-filtres-performants', 'Pagination et filtres performants', 'BACKEND', '2026-09-10 21:12:54.725898', 3);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (25, '2026-09-13 21:12:54.725898', 'Construisez un panier d''achat persistant : ajout, modification de quantité, suppression et calcul du total avec remises. Le panier survit à la déconnexion et reste cohérent entre deux onglets ouverts. Vous devez gérer les produits en rupture, les quantités invalides et les erreurs réseau sans perdre l''état.', false, 'INTERMEDIAIRE', 300, true, 'panier-ecommerce-fullstack', 'Panier e-commerce persistant', 'FULLSTACK', '2026-09-13 21:12:54.725898', 2);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (26, '2026-09-16 21:12:54.725898', 'Mettez en place une intégration continue qui compile, teste et vérifie la qualité à chaque push. Le pipeline exécute les tests unitaires et d''intégration, publie un rapport lisible et échoue clairement en cas de régression. Vous devez documenter la stratégie de branches et le temps d''exécution attendu.', false, 'INTERMEDIAIRE', 250, true, 'pipeline-ci-tests-automatises', 'Pipeline CI avec tests automatisés', 'BACKEND', '2026-09-16 21:12:54.725898', 4);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (27, '2026-09-19 21:12:54.725898', 'Créez un catalogue de produits consultable avec recherche textuelle, tri et filtres par catégorie et par prix. Vous soignez le modèle de données, exposez une API de recherche tolérante aux fautes de frappe et affichez des résultats pertinents. L''interface reste fluide même avec plusieurs milliers de produits.', false, 'DEBUTANT', 150, true, 'catalogue-produits-recherche', 'Catalogue produits avec recherche', 'FULLSTACK', '2026-09-19 21:12:54.725898', 2);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (28, '2026-09-22 21:12:54.725898', 'Permettez l''upload d''images avec validation du type et de la taille, génération de vignettes et stockage dans un service objet. Le backend ne sert pas de proxy binaire inutile et produit des URLs signées à durée limitée. Vous gérez les fichiers corrompus, les doublons et le nettoyage des fichiers orphelins.', false, 'AVANCE', 350, true, 'upload-images-stockage-objet', 'Upload d''images et stockage objet', 'BACKEND', '2026-09-22 21:12:54.725898', 1);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (29, '2026-09-25 21:12:54.725898', 'Ajoutez un cache distribué devant des requêtes coûteuses : stratégie de clés, durée de vie, invalidation à l''écriture et protection contre les pannes du cache. Vous mesurez le gain réel avant et après, et garantissez que l''application reste fonctionnelle si Redis disparaît. L''évaluation porte sur la cohérence des données mises en cache et sur la robustesse du fallback.', true, 'AVANCE', 400, true, 'cache-distribue-redis', 'Cache distribué avec Redis', 'BACKEND', '2026-09-25 21:12:54.725898', 10);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (30, '2026-09-28 21:12:54.725898', 'Protégez une API publique contre les abus avec une limitation de débit par utilisateur et par adresse IP. Vous choisissez un algorithme adapté, renvoyez les en-têtes normalisés et distinguez les erreurs d''authentification des dépassements de quota. Le mécanisme doit rester correct sous charge concurrente.', true, 'AVANCE', 350, true, 'limitation-debit-api', 'Limitation de débit d''API', 'BACKEND', '2026-09-28 21:12:54.725898', 9);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (31, '2026-10-01 21:12:54.725898', 'Écrivez une suite de tests d''intégration qui démarre une vraie base PostgreSQL via Testcontainers et couvre les endpoints critiques. Les tests sont isolés, reproductibles et indépendants de l''ordre d''exécution, avec un jeu de données préparé proprement. Vous montrez comment la suite s''intègre au pipeline et quel est son temps d''exécution.', false, 'INTERMEDIAIRE', 300, true, 'tests-integration-testcontainers', 'Tests d''intégration avec Testcontainers', 'BACKEND', '2026-10-01 21:12:54.725898', 4);
INSERT INTO public.challenges (id, created_at, description, is_premium, level, points, reviewed, slug, title, type, updated_at, category_id) VALUES (32, '2026-10-04 21:12:54.725898', 'Développez une messagerie temps réel entre utilisateurs authentifiés : canaux, historique persistant et présence en ligne. Le serveur autorise l''accès par canal, diffuse les messages aux bons abonnés et gère les déconnexions brutales. Vous documentez le protocole et prouvez le comportement avec deux clients connectés simultanément.', true, 'AVANCE', 450, true, 'messagerie-temps-reel-websockets', 'Messagerie temps réel en WebSocket', 'FULLSTACK', '2026-10-04 21:12:54.725898', 2);

-- 5. Critères d'évaluation IA --------------------------------------------------
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (21, 'Séparation contrôleur/service/repository');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (21, 'Validation des entrées et codes HTTP');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (21, 'Gestion centralisée des erreurs');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (21, 'Lisibilité et nommage');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (21, 'Tests d''intégration des endpoints');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (22, 'Flux de connexion et rafraîchissement');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (22, 'Hachage des mots de passe');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (22, 'Autorisation par rôle');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (22, 'Gestion de l''expiration');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (22, 'Aucun secret exposé');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (23, 'Agrégats corrects côté serveur');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (23, 'Mise à jour sans rechargement');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (23, 'Gestion de la reconnexion');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (23, 'États de chargement et d''erreur');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (23, 'Lisibilité de l''interface');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (24, 'Requêtes paginées en base');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (24, 'Index pertinents');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (24, 'Stabilité de la pagination');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (24, 'Comportement sur volumes élevés');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (24, 'Qualité du SQL généré');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (25, 'Modèle de données du panier');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (25, 'Cohérence des totaux et remises');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (25, 'Persistance entre sessions');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (25, 'Gestion des cas limites');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (25, 'Expérience utilisateur');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (26, 'Pipeline reproductible');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (26, 'Couverture des tests');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (26, 'Rapports exploitables');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (26, 'Temps d''exécution maîtrisé');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (26, 'Documentation du workflow');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (27, 'Pertinence des résultats');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (27, 'Modèle de données produit');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (27, 'Réactivité de l''interface');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (27, 'Filtres combinés');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (27, 'Accessibilité de la recherche');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (28, 'Validation des fichiers');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (28, 'URLs signées et expiration');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (28, 'Doublons et fichiers orphelins');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (28, 'Performance de l''upload');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (28, 'Sécurité du stockage');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (29, 'Stratégie de clés et TTL');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (29, 'Invalidation à l''écriture');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (29, 'Mesure du gain de performance');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (29, 'Comportement sans cache');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (29, 'Cohérence des données');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (30, 'Algorithme de limitation');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (30, 'En-têtes de quota');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (30, 'Comportement concurrent');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (30, 'Codes d''erreur distincts');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (30, 'Documentation du contrat API');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (31, 'Isolation des tests');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (31, 'Reproductibilité');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (31, 'Couverture des parcours critiques');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (31, 'Préparation des données');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (31, 'Temps d''exécution');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (32, 'Autorisation par canal');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (32, 'Diffusion ciblée');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (32, 'Historique persistant');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (32, 'Reconnexion et présence');
INSERT INTO public.challenge_criteres_ia (challenge_id, critere) VALUES (32, 'Test avec deux clients');

-- 6. Technologies --------------------------------------------------------------
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (21, 'Java');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (21, 'Spring Boot');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (21, 'Spring Data JPA');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (21, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (21, 'Bean Validation');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (22, 'Java');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (22, 'Spring Security');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (22, 'JWT');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (22, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (22, 'BCrypt');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (23, 'Spring Boot');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (23, 'Next.js');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (23, 'React');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (23, 'TypeScript');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (23, 'WebSocket');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (24, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (24, 'Spring Data JPA');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (24, 'SQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (24, 'Hibernate');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (25, 'Spring Boot');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (25, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (25, 'React');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (25, 'TypeScript');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (25, 'REST');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (26, 'Maven');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (26, 'GitHub Actions');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (26, 'JUnit 5');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (26, 'Testcontainers');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (27, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (27, 'Spring Boot');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (27, 'Next.js');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (27, 'TypeScript');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (28, 'Spring Boot');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (28, 'S3');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (28, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (28, 'ImageIO');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (29, 'Redis');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (29, 'Spring Boot');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (29, 'Spring Cache');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (29, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (29, 'Micrometer');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (30, 'Spring Boot');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (30, 'Redis');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (30, 'Bucket4j');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (30, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (31, 'JUnit 5');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (31, 'Testcontainers');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (31, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (31, 'Spring Boot');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (31, 'Maven');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (32, 'Spring WebSocket');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (32, 'STOMP');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (32, 'PostgreSQL');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (32, 'React');
INSERT INTO public.challenge_technologies (challenge_id, technology) VALUES (32, 'TypeScript');

-- 7. Séquences -----------------------------------------------------------------
SELECT pg_catalog.setval('public.categories_id_seq', 16, true);
SELECT pg_catalog.setval('public.challenges_id_seq', 32, true);

-- 8. Contrôle ------------------------------------------------------------------
SELECT
    (SELECT COUNT(*) FROM challenges)               AS defis,
    (SELECT COUNT(*) FROM categories)               AS categories,
    (SELECT COUNT(*) FROM submissions)              AS soumissions,
    (SELECT COUNT(*) FROM analyses)                 AS analyses;

COMMIT;

-- =============================================================================
-- OPTIONNEL — repartir aussi de zéro côté comptes utilisateurs
-- (décommenter puis exécuter ; les utilisateurs devront se réinscrire)
-- =============================================================================
-- DELETE FROM submission_likes;
-- DELETE FROM analyses;
-- DELETE FROM comments;
-- DELETE FROM submissions;
-- DELETE FROM notifications;
-- DELETE FROM subscriptions;
-- DELETE FROM user_follows;
-- DELETE FROM auth_sessions;
-- DELETE FROM refresh_tokens;
-- DELETE FROM users;
-- SELECT setval('public.users_id_seq', 1, false);
