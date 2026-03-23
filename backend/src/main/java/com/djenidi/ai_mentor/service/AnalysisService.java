package com.djenidi.ai_mentor.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.djenidi.ai_mentor.models.Analysis;
import com.djenidi.ai_mentor.models.Project;
import com.djenidi.ai_mentor.models.Submission;
import com.djenidi.ai_mentor.models.Task;
import com.djenidi.ai_mentor.models.TaskResult;
import com.djenidi.ai_mentor.repository.AnalysisRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.TaskRepository;
import com.djenidi.ai_mentor.repository.TaskResultRepository;

@Service
@Transactional
public class AnalysisService {
    
    private final AnalysisRepository analysisRepository;
    private final SubmissionRepository submissionRepository;
    private final TaskRepository taskRepository;
    private final TaskResultRepository taskResultRepository;
    
    // Constructeur
    public AnalysisService(AnalysisRepository analysisRepository,
                           SubmissionRepository submissionRepository,
                           TaskRepository taskRepository,
                           TaskResultRepository taskResultRepository) {
        this.analysisRepository = analysisRepository;
        this.submissionRepository = submissionRepository;
        this.taskRepository = taskRepository;
        this.taskResultRepository = taskResultRepository;
    }
    
    @Async
    public void analyzeSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found with id: " + submissionId));
        
        Project project = submission.getProject();
        
        // Récupérer les tâches du projet
        List<Task> tasks = taskRepository.findByProjectId(project.getId());
        
        // Créer l'analyse
        Analysis analysis = new Analysis();
        analysis.setSubmission(submission);
        analysis.setAnalysisDate(LocalDateTime.now());
        
        // Simuler l'analyse par IA
        float overallScore = calculateScore(submission, tasks);
        analysis.setOverallScore(overallScore);
        analysis.setReportText(generateReport(submission, tasks));
        
        // Sauvegarder l'analyse
        Analysis savedAnalysis = analysisRepository.save(analysis);
        
        // Créer les résultats par tâche
        for (Task task : tasks) {
            TaskResult taskResult = new TaskResult();
            taskResult.setAnalysis(savedAnalysis);
            taskResult.setTask(task);
            taskResult.setChecked(evaluateTask(submission, task));
            taskResult.setAiComment(generateComment(submission, task));
            taskResultRepository.save(taskResult);
        }
    }
    
    /**
     * Calcule le score global de la soumission
     */
    private float calculateScore(Submission submission, List<Task> tasks) {
        if (tasks == null || tasks.isEmpty()) {
            return 0.0f;
        }
        
        int completedTasks = 0;
        for (Task task : tasks) {
            if (evaluateTask(submission, task)) {
                completedTasks++;
            }
        }
        
        return (float) completedTasks / tasks.size() * 100;
    }
    
    /**
     * Évalue une tâche spécifique
     */
    private boolean evaluateTask(Submission submission, Task task) {
        // Logique d'évaluation par tâche à implémenter
        if (task.getCriteria() != null && !task.getCriteria().isEmpty()) {
            // Simuler une évaluation (à remplacer par votre logique réelle)
            return task.getCriteria().length() > 10;
        }
        return false;
    }
    
    /**
     * Génère un commentaire pour une tâche spécifique
     */
    private String generateComment(Submission submission, Task task) {
        StringBuilder comment = new StringBuilder();
        
        if (evaluateTask(submission, task)) {
            comment.append("Bon travail ! ");
            comment.append("La tâche a été bien réalisée.");
        } else {
            comment.append("Points à améliorer : ");
            comment.append("La tâche n'est pas complètement satisfaisante. ");
            
            if (task.getCriteria() != null) {
                comment.append("Critères attendus : ").append(task.getCriteria());
            }
        }
        
        return comment.toString();
    }
    
    /**
     * Génère un rapport complet de l'analyse
     */
    private String generateReport(Submission submission, List<Task> tasks) {
        StringBuilder report = new StringBuilder();
        
        report.append("RAPPORT D'ANALYSE\n");
        report.append("==================\n\n");
        
        report.append("Projet : ").append(submission.getProject().getTitle()).append("\n");
        report.append("Étudiant : ").append(submission.getUser().getUsername()).append("\n");
        report.append("GitHub : ").append(submission.getGithubUrl()).append("\n");
        report.append("Date de soumission : ").append(submission.getSubmissionDate()).append("\n\n");
        
        report.append("Évaluation des tâches :\n");
        report.append("------------------------\n");
        
        int taskNumber = 1;
        for (Task task : tasks) {
            boolean checked = evaluateTask(submission, task);
            report.append(taskNumber++).append(". ");
            report.append(task.getDescription()).append(" : ");
            report.append(checked ? "Réussi" : "Non réussi");
            report.append("\n");
            
            if (!checked && task.getCriteria() != null) {
                report.append("   Critères : ").append(task.getCriteria()).append("\n");
            }
        }
        
        float overallScore = calculateScore(submission, tasks);
        report.append("\nScore global : ").append(String.format("%.2f", overallScore)).append("%\n");
        
        // Ajouter des recommandations
        if (overallScore >= 80) {
            report.append("\nFélicitations ! Excellent travail !");
        } else if (overallScore >= 60) {
            report.append("\nBon travail ! Quelques points à améliorer.");
        } else if (overallScore >= 40) {
            report.append("\nTravail à revoir. Consultez les commentaires.");
        } else {
            report.append("\nLe travail nécessite une refonte complète.");
        }
        
        return report.toString();
    }
    
    /**
     * Récupère l'analyse d'une soumission
     */
    public Analysis getAnalysisBySubmission(Long submissionId) {
        return analysisRepository.findBySubmissionId(submissionId)
            .orElseThrow(() -> new RuntimeException("Analysis not found for submission: " + submissionId));
    }
    
    /**
     * Récupère une analyse par son ID
     */
    public Analysis getAnalysisById(Long id) {
        return analysisRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Analysis not found with id: " + id));
    }
    
    /**
     * Récupère une analyse avec ses résultats de tâches
     */
    public Analysis getAnalysisWithTaskResults(Long id) {
        return analysisRepository.findAnalysisWithTaskResultsById(id)
            .orElseThrow(() -> new RuntimeException("Analysis not found with id: " + id));
    }
    
    /**
     * Récupère toutes les analyses d'un utilisateur
     */
    public List<Analysis> getAnalysesByUser(Long userId) {
        return analysisRepository.findByUserId(userId);
    }
    
    /**
     * Récupère toutes les analyses d'un projet
     */
    public List<Analysis> getAnalysesByProject(Long projectId) {
        return analysisRepository.findByProjectId(projectId);
    }
    
    /**
     * Récupère toutes les analyses
     */
    public List<Analysis> getAllAnalyses() {
        return analysisRepository.findAll();
    }
    
    /**
     * Récupère les meilleures analyses
     */
    public List<Analysis> getTopAnalyses(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return analysisRepository.findTopNByOrderByOverallScoreDesc(pageable);
    }
    
    /**
     * Récupère les analyses avec un score supérieur à un seuil
     */
    public List<Analysis> getAnalysesByScoreAbove(Float threshold) {
        return analysisRepository.findByOverallScoreGreaterThanOrderByOverallScoreDesc(threshold);
    }
    
    /**
     * Récupère les analyses avec un score inférieur à un seuil
     */
    public List<Analysis> getAnalysesByScoreBelow(Float threshold) {
        return analysisRepository.findByOverallScoreLessThan(threshold);
    }
    
    /**
     * Récupère les analyses récentes
     */
    public List<Analysis> getRecentAnalyses(int days) {
        LocalDateTime date = LocalDateTime.now().minusDays(days);
        return analysisRepository.findRecentAnalyses(date);
    }
    
    /**
     * Calcule le score moyen global
     */
    public Double getAverageOverallScore() {
        return analysisRepository.getAverageOverallScore();
    }
    
    /**
     * Calcule le score moyen par projet
     */
    public List<Object[]> getAverageScoreByProject() {
        return analysisRepository.getAverageScoreByProject();
    }
    
    /**
     * Calcule le score moyen par utilisateur
     */
    public List<Object[]> getAverageScoreByUser() {
        return analysisRepository.getAverageScoreByUser();
    }
    
    /**
     * Vérifie si une soumission a déjà été analysée
     */
    public boolean isAnalyzed(Long submissionId) {
        return analysisRepository.findBySubmissionId(submissionId).isPresent();
    }
}