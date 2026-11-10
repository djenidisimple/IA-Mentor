package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.prompt.AnalysisPromptTemplates;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.djenidi.ai_mentor.dto.response.OllamaDiagnosticResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.djenidi.ai_mentor.entity.Challenge;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service d'analyse utilisant l'API OpenRouter (endpoints compatibles OpenAI).
 * Le modèle et la liste de repli sont configurables ; les modèles gratuits
 * (suffixe ":free") sont privilégiés pour ne pas consommer de crédits.
 */
@Primary
@Service("openRouterService")
@RequiredArgsConstructor
@Slf4j
public class OpenRouterService implements AIService {

    private static final String DEFAULT_API_URL = "https://openrouter.ai/api/v1/chat/completions";
    private static final String DEFAULT_MODELS = "cohere/north-mini-code:free,google/gemma-4-31b-it:free";
    private static final int MAX_ATTEMPTS_PER_MODEL = 2;
    private static final long RETRY_DELAY_MS = 1500;
    private static final String SYSTEM_PROMPT =
            "Tu es un expert en analyse de code. Réponds TOUJOURS en JSON valide avec la structure exacte demandée.";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AnalysisPromptTemplates promptTemplates;

    @Value("${ai.api.url:" + DEFAULT_API_URL + "}")
    private String apiUrl;

    @Value("${ai.api.key:}")
    private String apiKey;

    @Value("${ai.models:" + DEFAULT_MODELS + "}")
    private String models;

    @Value("${ai.max.tokens:4096}")
    private int maxTokens;

    @Override
    public AIAnalysisResult analyzeRepository(RepositoryContentResponse repository, Challenge challenge) {
        try {
            if (repository.getFiles() == null || repository.getFiles().isEmpty()) {
                return getFallbackAnalysis("Aucun fichier de code n'a été récupéré depuis le dépôt.");
            }
            String codeContent = extractCodeContent(repository);

            String prompt = promptTemplates.buildAnalysisPrompt(codeContent, challenge, repository);

            String response = callChatWithFallback(prompt);

            return parseResponse(response);

        } catch (Exception e) {
            log.error("❌ Analyse OpenRouter échouée", e);
            return getFallbackAnalysis("L'analyse IA n'a pas pu être complétée : " + e.getMessage());
        }
    }

    private String extractCodeContent(RepositoryContentResponse repository) {
        if (repository.getFiles() == null || repository.getFiles().isEmpty()) {
            return "Aucun fichier de code trouvé dans le repository.";
        }

        return repository.getFiles().stream()
                .filter(file -> file.getContent() != null && !file.getContent().isEmpty())
                .map(file -> String.format(
                    "=== Fichier: %s ===\n```%s\n%s\n```\n",
                    file.getPath(),
                    file.getExtension() == null ? "" : file.getExtension().replace(".", ""),
                    truncateContent(file.getContent(), 2000)
                ))
                .limit(25)
                .collect(Collectors.joining("\n"));
    }

    private String truncateContent(String content, int maxLength) {
        if (content == null || content.isEmpty()) {
            return "// Fichier vide";
        }
        if (content.length() <= maxLength) {
            return content;
        }
        return content.substring(0, maxLength) + "\n// ... (contenu tronqué)";
    }

    private List<String> configuredModels() {
        List<String> result = new ArrayList<>();
        for (String candidate : models.split(",")) {
            String cleaned = candidate.trim();
            if (!cleaned.isEmpty() && !result.contains(cleaned)) {
                result.add(cleaned);
            }
        }
        if (result.isEmpty()) {
            result.add(DEFAULT_MODELS.split(",")[0]);
        }
        return result;
    }

    /**
     * Essaie chaque modèle configuré, avec quelques tentatives par modèle :
     * les endpoints gratuits renvoient parfois 429/503 quand ils sont saturés.
     */
    private String callChatWithFallback(String prompt) throws Exception {
        Exception lastException = null;

        for (String model : configuredModels()) {
            for (int attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
                try {
                    log.info("🔄 Appel OpenRouter avec le modèle {} (tentative {}/{})",
                            model, attempt, MAX_ATTEMPTS_PER_MODEL);
                    return callChat(prompt, model);
                } catch (Exception e) {
                    lastException = e;
                    log.warn("⚠️ Appel OpenRouter échoué avec {} (tentative {} de {}): {}",
                            model, attempt, MAX_ATTEMPTS_PER_MODEL, e.getMessage());
                    if (attempt < MAX_ATTEMPTS_PER_MODEL) {
                        Thread.sleep(RETRY_DELAY_MS * attempt);
                    }
                }
            }
        }

        log.error("❌ Tous les modèles OpenRouter configurés ont échoué");
        throw lastException == null
                ? new IllegalStateException("Aucun modèle OpenRouter configuré")
                : lastException;
    }

    private String callChat(String prompt, String model) throws Exception {
        log.info("🌐 Appel de l'API OpenRouter (modèle: {}, prompt: {} caractères)", model, prompt.length());

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OPENROUTER_API_KEY n'est pas configurée");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("X-Title", "IA Mentor");

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", model);
        requestBody.put("temperature", 0.3);
        requestBody.put("max_tokens", maxTokens);
        requestBody.put("top_p", 1.0);

        ArrayNode messages = objectMapper.createArrayNode();
        ObjectNode systemMessage = objectMapper.createObjectNode();
        systemMessage.put("role", "system");
        systemMessage.put("content", SYSTEM_PROMPT);
        messages.add(systemMessage);

        ObjectNode userMessage = objectMapper.createObjectNode();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);

        requestBody.set("messages", messages);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

        if (response.getBody() == null || response.getBody().isEmpty()) {
            throw new IllegalStateException("OpenRouter a retourné une réponse vide");
        }

        JsonNode json = objectMapper.readTree(response.getBody());

        if (json.has("error")) {
            String errorMessage = json.path("error").path("message").asText("Erreur inconnue");
            throw new IllegalStateException("Erreur OpenRouter: " + errorMessage);
        }

        JsonNode choice = json.path("choices").path(0);
        String result = choice.path("message").path("content").asText();

        if (result == null || result.isEmpty()) {
            throw new IllegalStateException("OpenRouter a retourné un contenu vide (finish_reason: "
                    + choice.path("finish_reason").asText("inconnu") + ")");
        }

        log.info("📥 Réponse OpenRouter reçue ({} caractères, finish_reason: {})",
                result.length(), choice.path("finish_reason").asText("inconnu"));
        return result;
    }

    private AIAnalysisResult parseResponse(String jsonResponse) {
        try {
            String cleanedJson = extractJson(jsonResponse);
            JsonNode root = objectMapper.readTree(cleanedJson);

            String summary = root.path("summary").asText("Analyse complétée");
            String detailedFeedback = root.path("detailedFeedback").asText("Aucun détail fourni");
            int score = Math.min(100, Math.max(0, root.path("score").asInt(0)));

            String strengths = extractJsonArray(root, "strengths");
            String weaknesses = extractJsonArray(root, "weaknesses");
            String suggestions = extractJsonArray(root, "suggestions");

            JsonNode metricsNode = root.path("codeQualityMetrics");
            String codeQualityMetrics = metricsNode.isMissingNode()
                    ? buildDefaultMetrics()
                    : metricsNode.toString();

            return new AIAnalysisResult(
                summary,
                detailedFeedback,
                score,
                strengths,
                weaknesses,
                suggestions,
                codeQualityMetrics
            );

        } catch (Exception e) {
            log.error("Erreur lors du parsing de la réponse OpenRouter: {}", e.getMessage());
            return getFallbackAnalysis("La réponse du modèle n'était pas un JSON exploitable.");
        }
    }

    private String extractJson(String response) {
        response = response.trim();

        int jsonStart = response.indexOf('{');
        int jsonEnd = response.lastIndexOf('}');

        if (jsonStart >= 0 && jsonEnd > jsonStart) {
            response = response.substring(jsonStart, jsonEnd + 1);
        }

        response = response.replace("```json", "").replace("```", "").trim();

        return response;
    }

    private String extractJsonArray(JsonNode root, String fieldName) {
        JsonNode arrayNode = root.path(fieldName);

        if (arrayNode.isArray()) {
            return arrayNode.toString();
        }

        if (arrayNode.isTextual()) {
            try {
                String text = arrayNode.asText();
                JsonNode parsed = objectMapper.readTree(text);
                if (parsed.isArray()) {
                    return parsed.toString();
                }
            } catch (Exception e) {
                // Fallback
            }
            return "[\"" + arrayNode.asText().replace("\"", "\\\"") + "\"]";
        }

        return "[]";
    }

    private String buildDefaultMetrics() {
        try {
            ObjectNode metrics = objectMapper.createObjectNode();
            metrics.put("commentRatio", 0.0);
            metrics.put("hasReadme", false);
            metrics.put("hasTests", false);
            metrics.put("complexityScore", 0.0);
            metrics.put("maintainabilityIndex", 0);
            metrics.put("analyzer", "OpenRouter");
            return metrics.toString();
        } catch (Exception e) {
            return "{}";
        }
    }

    private AIAnalysisResult getFallbackAnalysis(String reason) {
        return new AIAnalysisResult(
            "Analyse indisponible",
            reason == null || reason.isBlank()
                    ? "L'analyse IA n'a pas pu être complétée."
                    : reason,
            0,
            "[]",
            "[]",
            "[]",
            buildDefaultMetrics()
        );
    }

    public boolean testConnection() {
        if (apiKey == null || apiKey.isBlank()) {
            log.error("❌ OPENROUTER_API_KEY n'est pas configurée");
            return false;
        }

        for (String model : configuredModels()) {
            try {
                log.info("🧪 Test de connexion à OpenRouter avec le modèle {}...", model);
                exchangeTestRequest(model);
                log.info("✅ Connexion à OpenRouter réussie avec {}", model);
                return true;
            } catch (Exception e) {
                log.error("❌ Connexion à OpenRouter échouée avec {}: {}", model, e.getMessage());
            }
        }
        return false;
    }

    private void exchangeTestRequest(String model) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("X-Title", "IA Mentor");

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", model);
        requestBody.put("temperature", 0.1);
        requestBody.put("max_tokens", 64);

        ArrayNode messages = objectMapper.createArrayNode();
        ObjectNode testMessage = objectMapper.createObjectNode();
        testMessage.put("role", "user");
        testMessage.put("content", "Réponds uniquement par: OK");
        messages.add(testMessage);
        requestBody.set("messages", messages);

        HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IllegalStateException("Statut HTTP " + response.getStatusCode());
        }

        JsonNode json = objectMapper.readTree(response.getBody() == null ? "{}" : response.getBody());
        if (json.has("error")) {
            throw new IllegalStateException(json.path("error").path("message").asText("Erreur OpenRouter"));
        }
    }

    /**
     * Diagnostic exposé par /api/groq/diagnose (réponse au format historique conservé).
     */
    public OllamaDiagnosticResponse runDiagnostics() {
        long startTime = System.currentTimeMillis();

        OllamaDiagnosticResponse response = OllamaDiagnosticResponse.builder()
                .apiUrl(apiUrl)
                .model(configuredModels().get(0))
                .testMessage("")
                .errorDetails("")
                .build();

        try {
            boolean connected = testConnection();
            response.setServiceAvailable(connected);
            response.setConnectionSuccessful(connected);
            response.setModelAvailable(connected);
            response.setTestMessage(connected
                    ? "✅ OpenRouter API is accessible"
                    : "❌ OpenRouter API not accessible");
            if (!connected) {
                response.setErrorDetails("Failed to connect - check OPENROUTER_API_KEY");
                response.setOllamaErrorMessage("Connection failed");
            }
            log.info("✅ OpenRouter diagnostics terminés: connected={}", connected);
        } catch (Exception e) {
            response.setServiceAvailable(false);
            response.setConnectionSuccessful(false);
            response.setErrorDetails(e.getMessage());
            response.setOllamaErrorMessage(e.toString());
            log.error("❌ OpenRouter diagnostics échoués: {}", e.getMessage());
        }

        response.setResponseTimeMs(System.currentTimeMillis() - startTime);
        return response;
    }
}
