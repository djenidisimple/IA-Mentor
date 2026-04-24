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
import jakarta.annotation.PostConstruct;
import com.djenidi.ai_mentor.entity.Challenge;

import java.util.stream.Collectors;

/**
 * Service d'analyse utilisant Groq API
 * Remplace OllamaService pour l'analyse cloud du code
 * Groq offre des réponses ultra-rapides avec les modèles Llama
 */
@Primary
@Service("groqService")
@RequiredArgsConstructor
@Slf4j
public class GroqService implements AIService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AnalysisPromptTemplates promptTemplates;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String groqApiUrl;

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.model}")
    private String model;

    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY_MS = 2000;


    @Override
    public AIAnalysisResult analyzeRepository(RepositoryContentResponse repository, Challenge challenge) {
        try {
            
            if (repository.getFiles() == null || repository.getFiles().isEmpty()) {
                return getFallbackAnalysis();
            }
            String codeContent = extractCodeContent(repository);
            
            String prompt = promptTemplates.buildAnalysisPrompt(codeContent, challenge, repository);
            
            String response = callGroqWithRetry(prompt);
            
            return parseResponse(response);
            
        } catch (Exception e) {
            log.error("❌ Analyse Groq échouée", e);
            return getFallbackAnalysis();
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
                    file.getExtension().replace(".", ""),
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

    private String callGroqWithRetry(String prompt) throws Exception {
        Exception lastException = null;
        
        for (int i = 0; i < MAX_RETRIES; i++) {
            try {
                log.info("🔄 Tentative d'appel Groq {}/{}", i + 1, MAX_RETRIES);
                return callGroq(prompt);
            } catch (Exception e) {
                lastException = e;
                log.warn("⚠️ Appel Groq échoué (tentative {} de {}): {}", 
                    i + 1, MAX_RETRIES, e.getMessage());
                
                if (i < MAX_RETRIES - 1) {
                    long sleepTime = RETRY_DELAY_MS * (i + 1);
                    log.info("⏳ Nouvelle tentative dans {} ms...", sleepTime);
                    Thread.sleep(sleepTime);
                }
            }
        }
        
        log.error("❌ Les {} tentatives ont échoué!", MAX_RETRIES);
        throw lastException;
    }

    private String callGroq(String prompt) throws Exception {
        log.info("🌐 Appel de l'API Groq");
        log.debug("🤖 Modèle utilisé: {}", model);
        
        if (groqApiKey == null || groqApiKey.isEmpty()) {
            throw new RuntimeException("GROQ_API_KEY n'est pas configurée");
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + groqApiKey);

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", model);
        requestBody.put("temperature", 0.3);
        requestBody.put("max_tokens", 2048);
        requestBody.put("top_p", 1.0);

        ArrayNode messages = objectMapper.createArrayNode();
        ObjectNode systemMessage = objectMapper.createObjectNode();
        systemMessage.put("role", "system");
        systemMessage.put("content", "Tu es un expert en analyse de code. Réponds TOUJOURS en JSON valide avec la structure exacte demandée.");
        messages.add(systemMessage);

        ObjectNode userMessage = objectMapper.createObjectNode();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        messages.add(userMessage);

        requestBody.set("messages", messages);

        String jsonBody = objectMapper.writeValueAsString(requestBody);
        
        log.info("📤 Envoi de la requête à Groq (longueur du prompt: {})", prompt.length());
        
        try {
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    groqApiUrl, HttpMethod.POST, entity, String.class);

            if (response.getBody() == null || response.getBody().isEmpty()) {
                log.error("❌ Groq a retourné une réponse vide");
                throw new RuntimeException("Groq a retourné une réponse vide");
            }

            log.info("📥 Réponse reçue de Groq (statut: {})", response.getStatusCode());
            log.debug("Longueur de la réponse: {} caractères", response.getBody().length());

            JsonNode json = objectMapper.readTree(response.getBody());
            
            if (json.has("error")) {
                JsonNode errorNode = json.path("error");
                String errorMessage = errorNode.path("message").asText("Erreur inconnue");
                log.error("❌ Erreur Groq: {}", errorMessage);
                throw new RuntimeException("Erreur Groq: " + errorMessage);
            }

            String result = json.path("choices")
                    .path(0)
                    .path("message")
                    .path("content")
                    .asText();
            
            if (result == null || result.isEmpty()) {
                log.error("❌ Groq a retourné un contenu texte vide");
                throw new RuntimeException("Groq a retourné un contenu texte vide");
            }
            
            log.info(" Texte extrait avec succès de la réponse Groq (longueur: {})", result.length());
            return result;
            
        } catch (Exception e) {
            log.error("❌ Exception lors de l'appel Groq: {}", 
                e.getClass().getName() + ": " + e.getMessage());
            throw e;
        }
    }

    private AIAnalysisResult parseResponse(String jsonResponse) {
        try {
            String cleanedJson = extractJson(jsonResponse);
            JsonNode root = objectMapper.readTree(cleanedJson);
            
            String summary = root.path("summary").asText("Analyse complétée");
            String detailedFeedback = root.path("detailedFeedback").asText("Feedback généré par Groq");
            int score = Math.min(100, Math.max(0, root.path("score").asInt(70)));
            
            String strengths = extractJsonArray(root, "strengths");
            String weaknesses = extractJsonArray(root, "weaknesses");
            String suggestions = extractJsonArray(root, "suggestions");
            
            JsonNode metricsNode = root.path("codeQualityMetrics");
            String codeQualityMetrics = metricsNode.isMissingNode() ? 
                buildDefaultMetrics() : metricsNode.toString();
            
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
            log.error("Erreur lors du parsing de la réponse Groq: {}", jsonResponse, e);
            return getFallbackAnalysis();
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
            return "[\"" + arrayNode.asText() + "\"]";
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
            metrics.put("analyzer", "Groq Mixtral");
            return metrics.toString();
        } catch (Exception e) {
            return "{}";
        }
    }

    private AIAnalysisResult getFallbackAnalysis() {
        return new AIAnalysisResult(
            "Analyse indisponible",
            "L'analyse par Groq n'a pas pu être complétée. Vérifiez que votre clé API Groq (GROQ_API_KEY) est correctement configurée.",
            0,
            "[]",
            "[]",
            "[]",
            buildDefaultMetrics()
        );
    }

    public boolean testConnection() {
        try {
            log.info("🧪 Test de connexion à Groq...");
            
            if (groqApiKey == null || groqApiKey.isEmpty()) {
                log.error("❌ GROQ_API_KEY n'est pas configurée");
                return false;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + groqApiKey);

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", model);
            requestBody.put("temperature", 0.3);
            requestBody.put("max_tokens", 100);

            ArrayNode messages = objectMapper.createArrayNode();
            ObjectNode testMessage = objectMapper.createObjectNode();
            testMessage.put("role", "user");
            testMessage.put("content", "Test");
            messages.add(testMessage);

            requestBody.set("messages", messages);

            String jsonBody = objectMapper.writeValueAsString(requestBody);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                    groqApiUrl, HttpMethod.POST, entity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info(" Connexion à Groq réussie!");
                return true;
            }
        } catch (Exception e) {
            log.error("❌ Connexion à Groq échouée: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Diagnostic helper that mirrors the Ollama diagnostic response shape
     */
    public OllamaDiagnosticResponse runDiagnostics() {
        long startTime = System.currentTimeMillis();

        OllamaDiagnosticResponse response = OllamaDiagnosticResponse.builder()
                .apiUrl(groqApiUrl)
                .model(model)
                .testMessage("")
                .errorDetails("")
                .build();

        try {
            boolean connected = testConnection();
            response.setServiceAvailable(connected);
            response.setConnectionSuccessful(connected);
            response.setModelAvailable(connected);
            response.setTestMessage(connected ? " Groq API is accessible" : "❌ Groq API not accessible");
            if (!connected) {
                response.setErrorDetails("Failed to connect - check GROQ_API_KEY");
                response.setOllamaErrorMessage("Connection failed");
            }
            log.info(" Groq diagnostics completed: connected={}", connected);
        } catch (Exception e) {
            response.setServiceAvailable(false);
            response.setConnectionSuccessful(false);
            response.setErrorDetails(e.getMessage());
            response.setOllamaErrorMessage(e.toString());
            log.error("❌ Groq diagnostics failed: {}", e.getMessage());
        }

        response.setResponseTimeMs(System.currentTimeMillis() - startTime);
        return response;
    }
}
