package com.djenidi.ai_mentor.prompt;

import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.entity.Challenge;
import org.springframework.stereotype.Component;

@Component
public class AnalysisPromptTemplates {

    /**
     * Nouvelle signature : prend l'objet Challenge complet au lieu d'un simple String
     */
    public String buildAnalysisPrompt(String codeContent, Challenge challenge, RepositoryContentResponse repo) {
        double sizeKb = repo.getTotalSize() / 1024.0;
        String challengeStatement = buildChallengeStatement(challenge);

        return String.format("""
    Tu es un expert en programmation et un évaluateur technique rigoureux.

    ## 🎯 CONTEXTE DU SUJET
    %s

    ## 📁 CODE SOUMIS PAR LE CANDIDAT
    Repository: %s/%s
    Fichiers analysés: %d | Taille totale: %.1f KB

    %s

    ## 🧠 INSTRUCTIONS D'ÉVALUATION STRICTES
    1. Compare attentivement le code avec l'énoncé ci-dessus.
    2. Évalue la qualité technique selon les critères ci-dessous.
    3. Si le code ne correspond PAS au sujet, le score DOIT être inférieur à 50/100.

    ## 📊 CRITÈRES DE NOTATION (/100)
    - Adéquation au sujet (40 pts)
    - Qualité du code (20 pts)
    - Architecture (15 pts)
    - Gestion d'erreurs (10 pts)
    - Bonnes pratiques (15 pts)

    ## 📝 FORMAT DE RÉPONSE (JSON UNIQUEMENT, pas de markdown)
    {
        "isMatchingSubject": true,
        "matchingReason": "Explication concise",
        "summary": "Résumé global en 2-3 phrases",
        "detailedFeedback": "Analyse détaillée",
        "score": 75,
        "missingFeatures": ["Feature manquante 1"],
        "strengths": ["Point fort 1", "Point fort 2"],
        "weaknesses": ["Point faible 1"],
        "suggestions": ["Suggestion 1", "Suggestion 2"],
        "codeQualityMetrics": {
            "commentRatio": 0.15,
            "hasReadme": true,
            "hasTests": false,
            "complexityScore": 7.5,
            "maintainabilityIndex": 80
        }
    }

    Réponds TOUJOURS en français.
    """,
            challengeStatement,
            repo.getOwner(),
            repo.getRepo(),
            repo.getTotalFiles(),
            sizeKb,
            codeContent  // ✅ FIX 1 : était absent !
        );
    }

    /**
     * Construit un énoncé structuré à partir de l'objet Challenge
     */
    private String buildChallengeStatement(Challenge challenge) {
        StringBuilder sb = new StringBuilder();
        
        sb.append("### Titre du défi ###\n");
        sb.append(challenge.getTitle()).append("\n\n");
        
        sb.append("### Description / Énoncé ###\n");
        sb.append(challenge.getDescription()).append("\n\n");
        
        // Ajoute la difficulté si disponible
        if (challenge.getLevel() != null) {
            sb.append("### Difficulté ###\n");
            sb.append(challenge.getLevel()).append("\n\n");
        }
        
        // Ajoute la stack technologique attendue si disponible
        if (challenge.getTechnologies() != null && !challenge.getTechnologies().isEmpty()) {
            sb.append("### Stack technologique attendue ###\n");
            sb.append(challenge.getTechnologies()).append("\n\n");
        }
        
        return sb.toString();
    }

    // ========== ANCIENNE MÉTHODE (DÉPRÉCIÉE) ==========
    // Gardez-la temporairement pour éviter de casser d'autres appels
    // mais marquez-la comme @Deprecated
    
    /**
     * @deprecated Utilisez {@link #buildAnalysisPrompt(String, Challenge, RepositoryContentResponse)} à la place
     */
    @Deprecated
    public String buildAnalysisPrompt(String codeContent, String challengeContext, RepositoryContentResponse repo) {
        double sizeKb = repo.getTotalSize() / 1024.0;

        return String.format("""
Tu es un expert en programmation. Analyse le code suivant et fournis une évaluation en français.

CONTEXTE: %s
Repository: %s/%s
Fichiers: %d | Taille: %.1f KB

CODE:
%s

## 🧠 INSTRUCTIONS D'ÉVALUATION STRICTES
1. **ADÉQUATION AU SUJET** : Compare attentivement le code avec l'énoncé ci-dessus.
   - Le candidat a-t-il implémenté TOUTES les fonctionnalités demandées ?
   - Y a-t-il des fonctionnalités manquantes ?
   - Le candidat a-t-il fait du "hors-sujet" (ajouté des choses non demandées) ?

2. **QUALITÉ TECHNIQUE** (Critères détaillés ci-dessous)

3. **NOTATION** : Sois exigeant. Si le code ne correspond PAS au sujet, le score DOIT être inférieur à 50/100.

## 📊 CRITÈRES DE NOTATION (/100)
- **Adéquation au sujet** (40 pts) : Le code répond-il EXACTEMENT à ce qui était demandé ?
- **Qualité du code** (20 pts) : Lisibilité, nommage, structure
- **Architecture** (15 pts) : Organisation des fichiers, séparation des responsabilités
- **Gestion d'erreurs** (10 pts) : Try/catch, validations, messages d'erreur
- **Bonnes pratiques** (15 pts) : DRY, SOLID, conventions de la stack demandée

## 📝 FORMAT DE RÉPONSE EXIGÉ (JSON UNIQUEMENT)
Réponds UNIQUEMENT avec cet objet JSON valide (pas de markdown autour) :

{
    "isMatchingSubject": true,
    "matchingReason": "Explication concise de pourquoi le code correspond (ou non) au sujet",
    "summary": "Résumé global en 2-3 phrases sur la qualité du code",
    "detailedFeedback": "Analyse détaillée (qualité, architecture, lisibilité, adéquation)",
    "score": 75,
    "missingFeatures": ["Fonctionnalité manquante 1", "Fonctionnalité manquante 2"],
    "strengths": ["Point fort 1", "Point fort 2", "Point fort 3"],
    "weaknesses": ["Point faible 1", "Point faible 2"],
    "suggestions": ["Suggestion d'amélioration 1", "Suggestion d'amélioration 2"],
    "codeQualityMetrics": {
        "commentRatio": 0.15,
        "hasReadme": true,
        "hasTests": false,
        "complexityScore": 7.5,
        "maintainabilityIndex": 80
    }
}

**IMPORTANT** : 
- Si le code est hors-sujet, mets "isMatchingSubject": false et score < 50.
- Remplis "missingFeatures" avec les objectifs du sujet NON réalisés.
- Réponds TOUJOURS en français.
""",
            challengeContext,
            repo.getOwner(),
            repo.getRepo(),
            repo.getTotalFiles(),
            sizeKb,
            codeContent
        );
    }
}