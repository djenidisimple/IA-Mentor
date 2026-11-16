package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.prompt.AnalysisPromptTemplates;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Vérifie la tolérance du parsing des réponses des modèles OpenRouter :
 * les modèles gratuits entourent parfois le JSON de markdown, y insèrent des
 * retours à la ligne non échappés ou, plus grave, du texte de raisonnement.
 */
class OpenRouterResponseParsingTest {

    private final OpenRouterService service = new OpenRouterService(
            new RestTemplate(),
            new ObjectMapper(),
            new AnalysisPromptTemplates()
    );

    @Test
    void parsesJsonWrappedInMarkdownFenceWithTrailingProse() {
        String raw = """
                Voici mon analyse :
                ```json
                {
                  "summary": "API correcte",
                  "detailedFeedback": "Architecture en couches respectée.",
                  "score": 78,
                  "strengths": ["Lisibilité"],
                  "weaknesses": ["Tests absents"],
                  "suggestions": ["Ajouter des tests"],
                  "codeQualityMetrics": {"hasTests": false}
                }
                ```
                Bonne continuation !
                """;

        AIService.AIAnalysisResult result = service.parseResponse(raw);

        assertEquals(78, result.score());
        assertEquals("API correcte", result.summary());
        assertEquals("[\"Lisibilité\"]", result.strengths());
    }

    @Test
    void acceptsUnescapedNewlinesInsideStringValues() {
        String raw = """
                {
                  "summary": "Résumé",
                  "detailedFeedback": "Première ligne
                Deuxième ligne",
                  "score": 64
                }
                """;

        AIService.AIAnalysisResult result = service.parseResponse(raw);

        assertEquals(64, result.score());
    }

    @Test
    void normalizesScoreExpressedAsText() {
        String raw = """
                {"summary": "ok", "detailedFeedback": "ok", "score": "85/100"}
                """;

        AIService.AIAnalysisResult result = service.parseResponse(raw);

        assertEquals(85, result.score());
    }

    @Test
    void rejectsResponseContainingReasoningTextInsideTheObject() {
        // Sortie réellement observée avec cohere/north-mini-code:free
        String raw = """
                {
                  "isMatchingSubject": false,
                  "summary": "Projet de jeu",
                  "score": 20,
                  "codeQualityMetrics": {
                    "commentRatio": 0.0,
                    "hasReadme": false,
                    probably a typo: "hasReadme" should be "hasReadme"? Actually the field is "hasReadme".
                    "hasTests": false,
                    "complexityScore": 7.5,
                    "maintainabilityIndex": 45
                  }
                }
                """;

        assertThrows(IllegalStateException.class, () -> service.parseResponse(raw));
    }
}
