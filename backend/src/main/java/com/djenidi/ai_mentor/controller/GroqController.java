package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.response.OllamaDiagnosticResponse;
import com.djenidi.ai_mentor.service.GroqService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import com.djenidi.ai_mentor.service.AnalysisService;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/groq")
@RequiredArgsConstructor
@Slf4j
public class GroqController {

    private final GroqService groqService;
    private final AnalysisService analysisService; 

    @GetMapping("/test-analysis/{submissionId}")
    public ResponseEntity<String> testAnalysis(@PathVariable Long submissionId) {
        log.info("🧪 Test analyse directe pour submissionId={}", submissionId);
        return ResponseEntity.ok("Analyse déclenchée pour submissionId=" + submissionId);
        // try {
        //     analysisService.analyzeSubmission(submissionId);
        //     return ResponseEntity.ok("Analyse déclenchée pour submissionId=" + submissionId);
        // } catch (Exception e) {
        //     return ResponseEntity.ok("Erreur: " + e.getMessage());
        // }
    }

    /**
     * Diagnostic complet — ADMIN uniquement
     * Retourne : connexion, modèle, temps de réponse réel
     */
    @GetMapping("/diagnose")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OllamaDiagnosticResponse> diagnoseGroqAdmin() {
        log.info("🔍 Running Groq diagnostics (admin)");

        // ✅ FIX 1 + 3 : délègue à runDiagnostics() qui mesure le vrai temps de réponse
        OllamaDiagnosticResponse response = groqService.runDiagnostics();

        return ResponseEntity.ok(response);
    }

    /**
     * Test simple de connexion — authentifié
     * ✅ FIX 2 : @PreAuthorize("permitAll()") supprimé,
     *    gérer les routes publiques dans SecurityConfig avec .permitAll()
     */
    @GetMapping("/test")
    public ResponseEntity<OllamaDiagnosticResponse> testGroq() {
        log.info("🧪 Running Groq connection test");

        long start = System.currentTimeMillis(); // ✅ FIX 1 : mesure la durée réelle

        boolean isConnected = groqService.testConnection();

        OllamaDiagnosticResponse response = OllamaDiagnosticResponse.builder()
                .serviceAvailable(isConnected)
                .connectionSuccessful(isConnected)
                .modelAvailable(isConnected)
                .testMessage(isConnected
                        ? "✅ Groq API is accessible"
                        : "❌ Failed to connect - Verify GROQ_API_KEY")
                .ollamaErrorMessage(isConnected ? null : "Connection failed - Check your API key")
                .responseTimeMs(System.currentTimeMillis() - start) // ✅ durée réelle en ms
                .build();

        return ResponseEntity.ok(response);
    }
}