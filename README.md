# 🚀 Fullstack Mentor - AI Powered Learning Platform

**Fullstack Mentor** est une plateforme d'apprentissage destinée aux développeurs souhaitant se perfectionner sur des projets **Fullstack** et **Backend**. Inspirée de concepts comme Frontend Mentor, elle se distingue par l'utilisation de l'**Intelligence Artificielle** pour valider automatiquement les soumissions des utilisateurs en analysant leur code source.

---

## 📋 Table des Matières

* [Vision du Projet](https://www.google.com/search?q=%23-vision-du-projet)
* [Fonctionnalités Clés](https://www.google.com/search?q=%23-fonctionnalit%C3%A9s-cl%C3%A9s)
* [Architecture Technique](https://www.google.com/search?q=%23-architecture-technique)
* [Stack Technologique](https://www.google.com/search?q=%23-stack-technologique)
* [Installation](https://www.google.com/search?q=%23-installation)
* [Roadmap](https://www.google.com/search?q=%23-roadmap)

---

## 🎯 Vision du Projet

Le but est de combler le fossé entre les tutoriels théoriques et la pratique réelle. Contrairement aux plateformes purement visuelles, **Fullstack Mentor** se concentre sur :

* La logique métier (API, Sécurité, Architecture).
* La gestion des bases de données.
* La qualité du code et les bonnes pratiques.

---

## ✨ Fonctionnalités Clés

1. **Catalogue de Projets :** Des énoncés détaillés classés par difficulté (Junior, Intermédiaire, Expert).
2. **Soumission par GitHub :** L'utilisateur soumet simplement le lien de son repository.
3. **Analyse Intelligente (IA) :** * Clonage automatique du dépôt.
* Analyse sémantique du code par un LLM (via Java).
* Vérification des contraintes techniques (ex: validation des champs, hachage des mots de passe).


4. **Bilan Automatisé :** Génération d'un rapport de réussite cochant les tâches accomplies et suggérant des pistes d'amélioration.

---

## 🏗 Architecture Technique

Le projet suit une architecture **N-Tier (Multicouche)** pour garantir la stabilité et la maintenabilité, essentielle pour un projet en Java :

* **Controller :** Point d'entrée des requêtes REST.
* **Service :** Couche logique métier (incluant l'intégration IA).
* **Repository :** Abstraction de l'accès aux données avec Spring Data JPA.
* **Model/Entity :** Représentation des données avec Jakarta Persistence.

---

## 🛠 Stack Technologique

* **Backend :** Java 25 (LTS) & Spring Boot 3
* **Database :** PostgreSQL
* **ORM :** Hibernate / Spring Data JPA
* **Intelligence Artificielle :** Intégration API (OpenAI/Gemini) pour l'analyse de code
* **Gestion de version :** Git & GitHub

---

## ⚙️ Installation

### Prérequis

* JDK 25 ou supérieur
* Maven 3.6+
* PostgreSQL installé et configuré

### Étapes

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/fullstack-mentor.git

```


2. **Configurer la base de données**
Modifier le fichier `src/main/resources/application.properties` avec vos identifiants PostgreSQL.
3. **Lancer l'application**
```bash
mvn spring-boot:run

```



---

## 🗺 Roadmap

* [ ] Conception du MCD et des Entités JPA.
* [ ] Développement des APIs de gestion des utilisateurs et challenges.
* [ ] Implémentation du service de clonage automatique via JGit.
* [ ] Intégration de l'IA pour l'analyse automatique des tâches.
* [ ] Frontend avec Next.js/Tailwind CSS.