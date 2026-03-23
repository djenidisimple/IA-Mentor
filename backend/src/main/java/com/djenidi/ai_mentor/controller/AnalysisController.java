package com.djenidi.ai_mentor.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.djenidi.ai_mentor.models.Analysis;
import com.djenidi.ai_mentor.service.AnalysisService;

@RestController
@RequestMapping("/api/analyses")
@CrossOrigin(origins = "*")
public class AnalysisController {
    
    private final AnalysisService analysisService;
    
    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }
    
    /**
     * Récupère l'analyse d'une soumission
     */
    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<Analysis> getAnalysisBySubmission(@PathVariable Long submissionId) {
        Analysis analysis = analysisService.getAnalysisBySubmission(submissionId);
        return ResponseEntity.ok(analysis);
    }
    
    /**
     * Récupère une analyse par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Analysis> getAnalysisById(@PathVariable Long id) {
        Analysis analysis = analysisService.getAnalysisById(id);
        return ResponseEntity.ok(analysis);
    }
    
    /**
     * Récupère une analyse avec ses résultats de tâches
     */
    @GetMapping("/{id}/with-results")
    public ResponseEntity<Analysis> getAnalysisWithTaskResults(@PathVariable Long id) {
        Analysis analysis = analysisService.getAnalysisWithTaskResults(id);
        return ResponseEntity.ok(analysis);
    }
    
    /**
     * Récupère toutes les analyses d'un utilisateur
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Analysis>> getAnalysesByUser(@PathVariable Long userId) {
        List<Analysis> analyses = analysisService.getAnalysesByUser(userId);
        return ResponseEntity.ok(analyses);
    }
    
    /**
     * Récupère toutes les analyses d'un projet
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Analysis>> getAnalysesByProject(@PathVariable Long projectId) {
        List<Analysis> analyses = analysisService.getAnalysesByProject(projectId);
        return ResponseEntity.ok(analyses);
    }
    
    /**
     * Récupère toutes les analyses
     */
    @GetMapping
    public ResponseEntity<List<Analysis>> getAllAnalyses() {
        List<Analysis> analyses = analysisService.getAllAnalyses();
        return ResponseEntity.ok(analyses);
    }
    
    /**
     * Récupère les meilleures analyses
     */
    @GetMapping("/top")
    public ResponseEntity<List<Analysis>> getTopAnalyses(@RequestParam(defaultValue = "10") int limit) {
        List<Analysis> analyses = analysisService.getTopAnalyses(limit);
        return ResponseEntity.ok(analyses);
    }
    
    /**
     * Récupère les analyses avec un score supérieur à un seuil
     */
    @GetMapping("/score/above/{threshold}")
    public ResponseEntity<List<Analysis>> getAnalysesByScoreAbove(@PathVariable Float threshold) {
        List<Analysis> analyses = analysisService.getAnalysesByScoreAbove(threshold);
        return ResponseEntity.ok(analyses);
    }
    
    /**
     * Récupère les analyses avec un score inférieur à un seuil
     */
    @GetMapping("/score/below/{threshold}")
    public ResponseEntity<List<Analysis>> getAnalysesByScoreBelow(@PathVariable Float threshold) {
        List<Analysis> analyses = analysisService.getAnalysesByScoreBelow(threshold);
        return ResponseEntity.ok(analyses);
    }
    
    /**
     * Récupère les analyses récentes
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Analysis>> getRecentAnalyses(@RequestParam(defaultValue = "7") int days) {
        List<Analysis> analyses = analysisService.getRecentAnalyses(days);
        return ResponseEntity.ok(analyses);
    }
    
    /**
     * Calcule le score moyen global
     */
    @GetMapping("/stats/average-score")
    public ResponseEntity<Double> getAverageOverallScore() {
        Double average = analysisService.getAverageOverallScore();
        return ResponseEntity.ok(average);
    }
    
    /**
     * Calcule le score moyen par projet
     */
    @GetMapping("/stats/average-score-by-project")
    public ResponseEntity<List<Object[]>> getAverageScoreByProject() {
        List<Object[]> stats = analysisService.getAverageScoreByProject();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Calcule le score moyen par utilisateur
     */
    @GetMapping("/stats/average-score-by-user")
    public ResponseEntity<List<Object[]>> getAverageScoreByUser() {
        List<Object[]> stats = analysisService.getAverageScoreByUser();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Déclenche une analyse manuelle
     */
    @PostMapping("/trigger/{submissionId}")
    public ResponseEntity<String> triggerAnalysis(@PathVariable Long submissionId) {
        analysisService.analyzeSubmission(submissionId);
        return ResponseEntity.ok("Analysis triggered for submission: " + submissionId);
    }
    
    /**
     * Vérifie si une soumission a été analysée
     */
    @GetMapping("/submission/{submissionId}/is-analyzed")
    public ResponseEntity<Boolean> isAnalyzed(@PathVariable Long submissionId) {
        boolean isAnalyzed = analysisService.isAnalyzed(submissionId);
        return ResponseEntity.ok(isAnalyzed);
    }
}
