package com.djenidi.ai_mentor.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.djenidi.ai_mentor.models.TaskResult;
import com.djenidi.ai_mentor.repository.TaskResultRepository;

@Service
@Transactional
public class TaskResultService {
    
    private final TaskResultRepository taskResultRepository;
    
    public TaskResultService(TaskResultRepository taskResultRepository) {
        this.taskResultRepository = taskResultRepository;
    }
    
    /**
     * Récupère tous les résultats d'une analyse
     */
    public List<TaskResult> getTaskResultsByAnalysis(Long analysisId) {
        return taskResultRepository.findByAnalysisId(analysisId);
    }
    
    /**
     * Récupère un résultat par son ID
     */
    public TaskResult getTaskResultById(Long id) {
        return taskResultRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("TaskResult not found with id: " + id));
    }
    
    /**
     * Récupère tous les résultats d'une tâche
     */
    public List<TaskResult> getTaskResultsByTask(Long taskId) {
        return taskResultRepository.findByTaskId(taskId);
    }
    
    /**
     * Récupère un résultat par analyse et tâche
     */
    public TaskResult getTaskResultByAnalysisAndTask(Long analysisId, Long taskId) {
        return taskResultRepository.findByAnalysisIdAndTaskId(analysisId, taskId)
            .orElseThrow(() -> new RuntimeException("TaskResult not found for analysis: " + analysisId + " and task: " + taskId));
    }
    
    /**
     * Met à jour le commentaire AI d'un résultat
     */
    public TaskResult updateAiComment(Long id, String comment) {
        TaskResult taskResult = getTaskResultById(id);
        taskResult.setAiComment(comment);
        return taskResultRepository.save(taskResult);
    }
    
    /**
     * Met à jour le statut checked d'un résultat
     */
    public TaskResult updateChecked(Long id, Boolean checked) {
        TaskResult taskResult = getTaskResultById(id);
        taskResult.setChecked(checked);
        return taskResultRepository.save(taskResult);
    }
    
    /**
     * Récupère les résultats réussis d'une analyse
     */
    public List<TaskResult> getPassedTaskResults(Long analysisId) {
        return taskResultRepository.findByAnalysisIdAndChecked(analysisId, true);
    }
    
    /**
     * Récupère les résultats échoués d'une analyse
     */
    public List<TaskResult> getFailedTaskResults(Long analysisId) {
        return taskResultRepository.findByAnalysisIdAndChecked(analysisId, false);
    }
    
    /**
     * Récupère tous les résultats d'une analyse avec leurs détails
     */
    public List<TaskResult> getTaskResultsWithDetailsByAnalysis(Long analysisId) {
        return taskResultRepository.findTaskResultsWithDetailsByAnalysisId(analysisId);
    }
    
    /**
     * Vérifie si une tâche a des résultats
     */
    public boolean hasTaskResults(Long taskId) {
        return taskResultRepository.existsByTaskId(taskId);
    }
    
    /**
     * Compte le nombre de résultats pour une analyse
     */
    public long countByAnalysisId(Long analysisId) {
        return taskResultRepository.countByAnalysisId(analysisId);
    }
    
    /**
     * Compte le nombre de résultats pour une tâche
     */
    public long countByTaskId(Long taskId) {
        return taskResultRepository.countByTaskId(taskId);
    }
    
    /**
     * Compte le nombre de résultats réussis pour une analyse
     */
    public long countPassedByAnalysisId(Long analysisId) {
        return taskResultRepository.findByAnalysisIdAndChecked(analysisId, true).size();
    }
    
    /**
     * Compte le nombre de résultats échoués pour une analyse
     */
    public long countFailedByAnalysisId(Long analysisId) {
        return taskResultRepository.findByAnalysisIdAndChecked(analysisId, false).size();
    }
    
    /**
     * Calcule le taux de réussite pour une analyse
     */
    public double getSuccessRate(Long analysisId) {
        long total = countByAnalysisId(analysisId);
        if (total == 0) {
            return 0.0;
        }
        long passed = countPassedByAnalysisId(analysisId);
        return (double) passed / total * 100;
    }
    
    /**
     * Supprime tous les résultats d'une analyse
     */
    public void deleteByAnalysisId(Long analysisId) {
        taskResultRepository.deleteByAnalysisId(analysisId);
    }
    
    /**
     * Supprime tous les résultats d'une tâche
     */
    public void deleteByTaskId(Long taskId) {
        taskResultRepository.deleteByTaskId(taskId);
    }
    
    /**
     * Supprime un résultat
     */
    public void deleteTaskResult(Long id) {
        TaskResult taskResult = getTaskResultById(id);
        taskResultRepository.delete(taskResult);
    }
    
    /**
     * Crée un nouveau résultat de tâche
     */
    public TaskResult createTaskResult(TaskResult taskResult) {
        if (taskResult.getAnalysis() == null) {
            throw new RuntimeException("Analysis is required for TaskResult");
        }
        if (taskResult.getTask() == null) {
            throw new RuntimeException("Task is required for TaskResult");
        }
        return taskResultRepository.save(taskResult);
    }
    
    /**
     * Met à jour partiellement un résultat
     */
    public TaskResult patchTaskResult(Long id, TaskResult taskResultDetails) {
        TaskResult taskResult = getTaskResultById(id);
        
        if (taskResultDetails.getChecked() != null) {
            taskResult.setChecked(taskResultDetails.getChecked());
        }
        
        if (taskResultDetails.getAiComment() != null) {
            taskResult.setAiComment(taskResultDetails.getAiComment());
        }
        
        return taskResultRepository.save(taskResult);
    }
    
    /**
     * Récupère tous les résultats
     */
    public List<TaskResult> getAllTaskResults() {
        return taskResultRepository.findAll();
    }
    
    /**
     * Récupère les résultats par statut (réussi/échoué)
     */
    public List<TaskResult> getTaskResultsByChecked(Boolean checked) {
        return taskResultRepository.findByChecked(checked);
    }
    
    /**
     * Récupère les résultats d'une analyse avec leurs tâches
     */
    public List<TaskResult> getTaskResultsWithTasksByAnalysis(Long analysisId) {
        return taskResultRepository.findTaskResultsWithDetailsByAnalysisId(analysisId);
    }
}
