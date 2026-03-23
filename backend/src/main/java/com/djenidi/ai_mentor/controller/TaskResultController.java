package com.djenidi.ai_mentor.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.djenidi.ai_mentor.models.TaskResult;
import com.djenidi.ai_mentor.service.TaskResultService;

@RestController
@RequestMapping("/api/task-results")
@CrossOrigin(origins = "*")
public class TaskResultController {
    
    private final TaskResultService taskResultService;
    
    public TaskResultController(TaskResultService taskResultService) {
        this.taskResultService = taskResultService;
    }
    
    /**
     * Récupère tous les résultats d'une analyse
     */
    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<List<TaskResult>> getTaskResultsByAnalysis(@PathVariable Long analysisId) {
        List<TaskResult> results = taskResultService.getTaskResultsByAnalysis(analysisId);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Récupère un résultat par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResult> getTaskResultById(@PathVariable Long id) {
        TaskResult result = taskResultService.getTaskResultById(id);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Met à jour le commentaire AI d'un résultat
     */
    @PatchMapping("/{id}/comment")
    public ResponseEntity<TaskResult> updateAiComment(@PathVariable Long id, @RequestParam String comment) {
        TaskResult updated = taskResultService.updateAiComment(id, comment);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Met à jour le statut checked d'un résultat
     */
    @PatchMapping("/{id}/checked")
    public ResponseEntity<TaskResult> updateChecked(@PathVariable Long id, @RequestParam Boolean checked) {
        TaskResult updated = taskResultService.updateChecked(id, checked);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Récupère les résultats réussis d'une analyse
     */
    @GetMapping("/analysis/{analysisId}/passed")
    public ResponseEntity<List<TaskResult>> getPassedTaskResults(@PathVariable Long analysisId) {
        List<TaskResult> results = taskResultService.getPassedTaskResults(analysisId);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Récupère les résultats échoués d'une analyse
     */
    @GetMapping("/analysis/{analysisId}/failed")
    public ResponseEntity<List<TaskResult>> getFailedTaskResults(@PathVariable Long analysisId) {
        List<TaskResult> results = taskResultService.getFailedTaskResults(analysisId);
        return ResponseEntity.ok(results);
    }
}
