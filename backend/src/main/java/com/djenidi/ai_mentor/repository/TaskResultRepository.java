package com.djenidi.ai_mentor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.TaskResult;

@Repository
public interface TaskResultRepository extends JpaRepository<TaskResult, Long> {
    
    /**
     * Trouve tous les résultats d'analyse pour une analyse spécifique
     */
    List<TaskResult> findByAnalysisId(Long analysisId);
    
    /**
     * Trouve tous les résultats d'analyse pour une tâche spécifique
     */
    List<TaskResult> findByTaskId(Long taskId);
    
    /**
     * Trouve les résultats d'analyse par analyse et par tâche
     */
    Optional<TaskResult> findByAnalysisIdAndTaskId(Long analysisId, Long taskId);
    
    /**
     * Vérifie si une tâche a déjà des résultats d'analyse
     */
    boolean existsByTaskId(Long taskId);
    
    /**
     * Vérifie si une analyse a des résultats
     */
    boolean existsByAnalysisId(Long analysisId);
    
    /**
     * Compte le nombre de résultats pour une analyse
     */
    long countByAnalysisId(Long analysisId);
    
    /**
     * Compte le nombre de résultats pour une tâche
     */
    long countByTaskId(Long taskId);
    
    /**
     * Trouve tous les résultats d'analyse avec leurs détails (fetch join)
     */
    @Query("SELECT tr FROM TaskResult tr " +
           "LEFT JOIN FETCH tr.analysis " +
           "LEFT JOIN FETCH tr.task " +
           "WHERE tr.analysis.id = :analysisId")
    List<TaskResult> findTaskResultsWithDetailsByAnalysisId(@Param("analysisId") Long analysisId);
    
    /**
     * Supprime tous les résultats d'une analyse
     */
    @Modifying
    @Query("DELETE FROM TaskResult tr WHERE tr.analysis.id = :analysisId")
    void deleteByAnalysisId(@Param("analysisId") Long analysisId);
    
    /**
     * Supprime tous les résultats d'une tâche
     */
    @Modifying
    @Query("DELETE FROM TaskResult tr WHERE tr.task.id = :taskId")
    void deleteByTaskId(@Param("taskId") Long taskId);
    
    /**
     * Trouve les résultats avec leurs analyses associées
     */
    @Query("SELECT tr FROM TaskResult tr " +
           "LEFT JOIN FETCH tr.analysis " +
           "WHERE tr.task.id = :taskId")
    List<TaskResult> findTaskResultsWithAnalysisByTaskId(@Param("taskId") Long taskId);
    
    /**
     * Trouve les résultats par score de tâche (checked = true/false)
     */
    List<TaskResult> findByChecked(Boolean checked);
    
    /**
     * Trouve les résultats d'une analyse par statut (réussi/échoué)
     */
    List<TaskResult> findByAnalysisIdAndChecked(Long analysisId, Boolean checked);
    
    /**
     * Met à jour le commentaire AI pour un résultat spécifique
     */
    @Modifying
    @Query("UPDATE TaskResult tr SET tr.aiComment = :comment WHERE tr.id = :id")
    int updateAiComment(@Param("id") Long id, @Param("comment") String comment);
}