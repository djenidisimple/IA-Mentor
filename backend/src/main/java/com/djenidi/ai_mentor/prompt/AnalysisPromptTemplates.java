package com.djenidi.ai_mentor.prompt;

import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import org.springframework.stereotype.Component;

@Component
public class AnalysisPromptTemplates {

    public String buildAnalysisPrompt(String codeContent, String challengeContext, RepositoryContentResponse repo) {
        return String.format("""
            Tu es un mentor expert en programmation. Analyse le code suivant et fournis une évaluation détaillée en français.
            
            **Contexte du challenge** : %s
            
            **Repository** : %s/%s
            **Fichiers analysés** : %d
            **Taille totale** : %d KB
            
            **Code à analyser** :
            %s
            
            **Instructions** :
            Retourne UNIQUEMENT un objet JSON valide avec la structure suivante :
            {
                "summary": "Résumé global en 2-3 phrases",
                "detailedFeedback": "Analyse détaillée (qualité du code, architecture, lisibilité, bonnes pratiques)",
                "score": 75,
                "strengths": ["Point fort 1", "Point fort 2", "Point fort 3"],
                "weaknesses": ["Point faible 1", "Point faible 2"],
                "suggestions": ["Suggestion d'amélioration 1", "Suggestion d'amélioration 2", "Suggestion d'amélioration 3"],
                "codeQualityMetrics": {
                    "commentRatio": 0.15,
                    "hasReadme": true,
                    "hasTests": false,
                    "complexityScore": 7.5,
                    "maintainabilityIndex": 80
                }
            }
            
            Critères d'évaluation :
            - Qualité et propreté du code (30 points)
            - Architecture et structure (25 points)
            - Gestion des erreurs (15 points)
            - Documentation et commentaires (15 points)
            - Respect des bonnes pratiques (15 points)
            
            Score total sur 100.
            """,
            challengeContext,
            repo.getOwner(),
            repo.getRepo(),
            repo.getTotalFiles(),
            repo.getTotalSize() / 1024,
            codeContent
        );
    }
}
