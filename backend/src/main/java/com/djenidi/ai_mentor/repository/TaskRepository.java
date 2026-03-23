package com.djenidi.ai_mentor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    /**
     * Trouve toutes les tâches d'un projet
     */
    List<Task> findByProjectId(Long projectId);
    
    /**
     * Trouve toutes les tâches d'un projet triées par ID
     */
    List<Task> findByProjectIdOrderByIdAsc(Long projectId);
    
    /**
     * Trouve toutes les tâches d'un projet triées par description
     */
    List<Task> findByProjectIdOrderByDescriptionAsc(Long projectId);
    
    /**
     * Compte le nombre de tâches dans un projet
     */
    long countByProjectId(Long projectId);
    
    /**
     * Vérifie si un projet a des tâches
     */
    boolean existsByProjectId(Long projectId);
    
    /**
     * Trouve une tâche par son ID et l'ID du projet
     */
    Optional<Task> findByProjectIdAndId(Long projectId, Long taskId);
    
    /**
     * Trouve les tâches contenant un certain texte dans la description
     */
    List<Task> findByDescriptionContaining(String description);
    
    /**
     * Trouve les tâches contenant un certain texte dans les critères
     */
    List<Task> findByCriteriaContaining(String criteria);
    
    /**
     * Trouve les tâches par difficulté (via le projet)
     * Note: Cela nécessite une requête JPQL personnalisée
     */
    @Query("SELECT t FROM Task t WHERE t.project.difficulty = :difficulty")
    List<Task> findByProjectDifficulty(@Param("difficulty") String difficulty);
    
    /**
     * Trouve les tâches par technologie stack (via le projet)
     */
    @Query("SELECT t FROM Task t WHERE t.project.techStack LIKE %:tech%")
    List<Task> findByProjectTechStackContaining(@Param("tech") String tech);
    
    /**
     * Trouve les tâches avec leurs projets (fetch join pour éviter N+1 queries)
     */
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.project WHERE t.id = :id")
    Optional<Task> findTaskWithProjectById(@Param("id") Long id);
    
    /**
     * Trouve toutes les tâches d'un projet avec leurs résultats d'analyse
     */
    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.taskResults WHERE t.project.id = :projectId")
    List<Task> findTasksWithResultsByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Trouve les tâches qui n'ont pas encore été analysées
     */
    @Query("SELECT t FROM Task t WHERE t.id NOT IN (SELECT DISTINCT tr.task.id FROM TaskResult tr)")
    List<Task> findUnanalyzedTasks();
    
    /**
     * Trouve les tâches d'un projet qui n'ont pas encore été analysées
     */
    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId " +
           "AND t.id NOT IN (SELECT DISTINCT tr.task.id FROM TaskResult tr)")
    List<Task> findUnanalyzedTasksByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Supprime toutes les tâches d'un projet
     */
    @Modifying
    @Query("DELETE FROM Task t WHERE t.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Met à jour la description d'une tâche
     */
    @Modifying
    @Query("UPDATE Task t SET t.description = :description WHERE t.id = :id")
    int updateDescription(@Param("id") Long id, @Param("description") String description);
    
    /**
     * Met à jour les critères d'une tâche
     */
    @Modifying
    @Query("UPDATE Task t SET t.criteria = :criteria WHERE t.id = :id")
    int updateCriteria(@Param("id") Long id, @Param("criteria") String criteria);
}
