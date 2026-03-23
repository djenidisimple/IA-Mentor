package com.djenidi.ai_mentor.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.djenidi.ai_mentor.models.Submission;
import com.djenidi.ai_mentor.service.SubmissionService;
import com.djenidi.ai_mentor.service.AnalysisService;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {
    
    private final SubmissionService submissionService;
    private final AnalysisService analysisService;
    
    public SubmissionController(SubmissionService submissionService, AnalysisService analysisService) {
        this.submissionService = submissionService;
        this.analysisService = analysisService;
    }
    
    /**
     * Soumet un projet
     */
    @PostMapping
    public ResponseEntity<Submission> submitProject(@RequestBody Submission submission) {
        Submission submitted = submissionService.submitProject(submission);
        return new ResponseEntity<>(submitted, HttpStatus.CREATED);
    }
    
    /**
     * Récupère toutes les soumissions d'un utilisateur
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Submission>> getSubmissionsByUser(@PathVariable Long userId) {
        List<Submission> submissions = submissionService.getSubmissionsByUser(userId);
        return ResponseEntity.ok(submissions);
    }
    
    /**
     * Récupère toutes les soumissions d'un projet
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Submission>> getSubmissionsByProject(@PathVariable Long projectId) {
        List<Submission> submissions = submissionService.getSubmissionsByProject(projectId);
        return ResponseEntity.ok(submissions);
    }
    
    /**
     * Récupère une soumission par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Long id) {
        Submission submission = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(submission);
    }
    
    /**
     * Récupère une soumission par utilisateur et projet
     */
    @GetMapping("/user/{userId}/project/{projectId}")
    public ResponseEntity<Submission> getSubmissionByUserAndProject(@PathVariable Long userId, 
                                                                     @PathVariable Long projectId) {
        Submission submission = submissionService.getSubmissionByUserAndProject(userId, projectId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        return ResponseEntity.ok(submission);
    }
    
    /**
     * Récupère toutes les soumissions
     */
    @GetMapping
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        List<Submission> submissions = submissionService.getAllSubmissions();
        return ResponseEntity.ok(submissions);
    }
    
    /**
     * Met à jour une soumission
     */
    @PutMapping("/{id}")
    public ResponseEntity<Submission> updateSubmission(@PathVariable Long id, @RequestBody Submission submission) {
        Submission updatedSubmission = submissionService.updateSubmission(id, submission);
        return ResponseEntity.ok(updatedSubmission);
    }
    
    /**
     * Supprime une soumission
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Vérifie si un utilisateur a déjà soumis pour un projet
     */
    @GetMapping("/exists")
    public ResponseEntity<Boolean> hasUserSubmitted(@RequestParam Long userId, @RequestParam Long projectId) {
        boolean hasSubmitted = submissionService.hasUserSubmittedForProject(userId, projectId);
        return ResponseEntity.ok(hasSubmitted);
    }
    
    /**
     * Compte les soumissions d'un utilisateur
     */
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> countSubmissionsByUser(@PathVariable Long userId) {
        long count = submissionService.countSubmissionsByUser(userId);
        return ResponseEntity.ok(count);
    }
    
    /**
     * Compte les soumissions d'un projet
     */
    @GetMapping("/project/{projectId}/count")
    public ResponseEntity<Long> countSubmissionsByProject(@PathVariable Long projectId) {
        long count = submissionService.countSubmissionsByProject(projectId);
        return ResponseEntity.ok(count);
    }
    
    /**
     * Récupère les soumissions récentes
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Submission>> getRecentSubmissions() {
        List<Submission> submissions = submissionService.getRecentSubmissions();
        return ResponseEntity.ok(submissions);
    }
    
    /**
     * Vérifie si une soumission a une analyse
     */
    @GetMapping("/{submissionId}/has-analysis")
    public ResponseEntity<Boolean> hasAnalysis(@PathVariable Long submissionId) {
        boolean hasAnalysis = analysisService.isAnalyzed(submissionId);
        return ResponseEntity.ok(hasAnalysis);
    }
}
