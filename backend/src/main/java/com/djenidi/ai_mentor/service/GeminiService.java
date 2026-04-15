package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.prompt.AnalysisPromptTemplates;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService implements AIService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AnalysisPromptTemplates promptTemplates;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String geminiApiUrl;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String model;

    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY_MS = 2000;

    @Override
    public AIAnalysisResult analyzeRepository(RepositoryContentResponse repository, String challengeContext) {
        try {
            String codeContent = extractCodeContent(repository);
            String prompt = promptTemplates.buildAnalysisPrompt(codeContent, challengeContext, repository);
            
            String response = callGeminiWithRetry(prompt);
            return parseResponse(response);
            
        } catch (Exception e) {
            log.error("Gemini analysis failed", e);
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

    private String callGeminiWithRetry(String prompt) throws Exception {
        Exception lastException = null;
        
        for (int i = 0; i < MAX_RETRIES; i++) {
            try {
                return callGemini(prompt);
            } catch (Exception e) {
                lastException = e;
                log.warn("Gemini API call failed (attempt {} of {}): {}", i + 1, MAX_RETRIES, e.getMessage());
                
                if (i < MAX_RETRIES - 1) {
                    Thread.sleep(RETRY_DELAY_MS * (i + 1));
                }
            }
        }
        
        throw lastException;
    }

    private String callGemini(String prompt) throws Exception {
        String fullUrl = geminiApiUrl + "?key=" + geminiApiKey;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ObjectNode requestBody = objectMapper.createObjectNode();
        
        ArrayNode contents = objectMapper.createArrayNode();
        ObjectNode content = objectMapper.createObjectNode();
        ArrayNode parts = objectMapper.createArrayNode();
        ObjectNode part = objectMapper.createObjectNode();
        
        part.put("text", prompt);
        parts.add(part);
        content.set("parts", parts);
        contents.add(content);
        requestBody.set("contents", contents);
        
        ObjectNode generationConfig = objectMapper.createObjectNode();
        generationConfig.put("temperature", 0.3);
        generationConfig.put("topK", 40);
        generationConfig.put("topP", 0.95);
        generationConfig.put("maxOutputTokens", 2048);
        generationConfig.put("responseMimeType", "application/json");
        requestBody.set("generationConfig", generationConfig);

        String jsonBody = objectMapper.writeValueAsString(requestBody);
        
        log.debug("Calling Gemini API with prompt length: {}", prompt.length());
        
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(
                fullUrl, HttpMethod.POST, entity, String.class);

        if (response.getBody() == null) {
            throw new RuntimeException("Gemini API returned empty response");
        }

        JsonNode json = objectMapper.readTree(response.getBody());
        
        if (json.has("error")) {
            String errorMessage = json.path("error").path("message").asText("Unknown error");
            throw new RuntimeException("Gemini API error: " + errorMessage);
        }

        return json.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText();
    }

    private AIAnalysisResult parseResponse(String jsonResponse) {
        try {
            String cleanedJson = extractJson(jsonResponse);
            JsonNode root = objectMapper.readTree(cleanedJson);
            
            String summary = root.path("summary").asText("Analyse complétée");
            String detailedFeedback = root.path("detailedFeedback").asText("Feedback généré par Gemini");
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
            log.error("Failed to parse Gemini response: {}", jsonResponse, e);
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
            metrics.put("analyzer", "Gemini AI");
            return metrics.toString();
        } catch (Exception e) {
            return "{}";
        }
    }

    private AIAnalysisResult getFallbackAnalysis() {
        return new AIAnalysisResult(
            "Analyse indisponible",
            "L'analyse par Gemini n'a pas pu être complétée. Veuillez réessayer plus tard.",
            0,
            "[]",
            "[]",
            "[]",
            buildDefaultMetrics()
        );
    }

    public boolean testConnection() {
        try {
            String testPrompt = "Réponds simplement 'OK' en JSON: {\"status\": \"OK\"}";
            String response = callGemini(testPrompt);
            return response != null && response.contains("OK");
        } catch (Exception e) {
            log.error("Gemini connection test failed", e);
            return false;
        }
    }
}
