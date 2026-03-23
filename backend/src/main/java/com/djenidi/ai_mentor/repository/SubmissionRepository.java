package com.djenidi.ai_mentor.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    // ===== Méthodes de base =====
    
    /**
     * Trouve toutes les soumissions d'un utilisateur
     */
    List<Submission> findByUserId(Long userId);
    
    /**
     * Trouve toutes les soumissions d'un projet
     */
    List<Submission> findByProjectId(Long projectId);
    
    /**
     * Trouve une soumission par utilisateur et projet
     */
    Optional<Submission> findByUserIdAndProjectId(Long userId, Long projectId);
    
    // ===== Méthodes de tri =====
    
    /**
     * Trouve les soumissions d'un utilisateur triées par date (plus récentes d'abord)
     */
    List<Submission> findByUserIdOrderBySubmissionDateDesc(Long userId);
    
    /**
     * Trouve les soumissions d'un projet triées par date (plus récentes d'abord)
     */
    List<Submission> findByProjectIdOrderBySubmissionDateDesc(Long projectId);
    
    /**
     * Trouve toutes les soumissions triées par date (plus récentes d'abord)
     */
    List<Submission> findAllByOrderBySubmissionDateDesc();
    
    // ===== Méthodes de comptage =====
    
    /**
     * Compte le nombre de soumissions d'un utilisateur
     */
    long countByUserId(Long userId);
    
    /**
     * Compte le nombre de soumissions d'un projet
     */
    long countByProjectId(Long projectId);
    
    /**
     * Vérifie si un utilisateur a soumis pour un projet
     */
    boolean existsByUserIdAndProjectId(Long userId, Long projectId);
    
    // ===== Recherche par date =====
    
    /**
     * Trouve les soumissions après une certaine date
     */
    List<Submission> findBySubmissionDateAfter(LocalDateTime date);
    
    /**
     * Trouve les soumissions avant une certaine date
     */
    List<Submission> findBySubmissionDateBefore(LocalDateTime date);
    
    /**
     * Trouve les soumissions entre deux dates
     */
    List<Submission> findBySubmissionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Trouve les soumissions d'un utilisateur après une certaine date
     */
    List<Submission> findByUserIdAndSubmissionDateAfter(Long userId, LocalDateTime date);
    
    /**
     * Trouve les soumissions récentes (derniers N jours)
     */
    @Query("SELECT s FROM Submission s WHERE s.submissionDate >= :date")
    List<Submission> findRecentSubmissions(@Param("date") LocalDateTime date);
    
    // ===== Recherche avec critères =====
    
    /**
     * Trouve les soumissions par URL GitHub
     */
    Optional<Submission> findByGithubUrl(String githubUrl);
    
    /**
     * Trouve les soumissions contenant un certain texte dans l'explication
     */
    List<Submission> findByExplanationContaining(String keyword);
    
    // ===== Requêtes avec fetch join (évitent les N+1 queries) =====
    
    /**
     * Trouve une soumission avec son utilisateur et son projet
     */
    @Query("SELECT s FROM Submission s " +
           "LEFT JOIN FETCH s.user " +
           "LEFT JOIN FETCH s.project " +
           "WHERE s.id = :id")
    Optional<Submission> findSubmissionWithDetailsById(@Param("id") Long id);
    
    /**
     * Trouve les soumissions d'un utilisateur avec leurs projets
     */
    @Query("SELECT s FROM Submission s " +
           "LEFT JOIN FETCH s.project " +
           "WHERE s.user.id = :userId " +
           "ORDER BY s.submissionDate DESC")
    List<Submission> findSubmissionsByUserWithProjects(@Param("userId") Long userId);
    
    /**
     * Trouve les soumissions d'un projet avec leurs utilisateurs
     */
    @Query("SELECT s FROM Submission s " +
           "LEFT JOIN FETCH s.user " +
           "WHERE s.project.id = :projectId " +
           "ORDER BY s.submissionDate DESC")
    List<Submission> findSubmissionsByProjectWithUsers(@Param("projectId") Long projectId);
    
    /**
     * Trouve toutes les soumissions avec leurs utilisateurs et projets
     */
    @Query("SELECT s FROM Submission s " +
           "LEFT JOIN FETCH s.user " +
           "LEFT JOIN FETCH s.project " +
           "ORDER BY s.submissionDate DESC")
    List<Submission> findAllSubmissionsWithDetails();
    
    // ===== Requêtes pour les analyses =====
    
    /**
     * Trouve les soumissions qui n'ont pas encore été analysées
     */
    @Query("SELECT s FROM Submission s " +
           "WHERE NOT EXISTS (SELECT a FROM Analysis a WHERE a.submission = s)")
    List<Submission> findUnanalyzedSubmissions();
    
    /**
     * Trouve les soumissions d'un projet qui n'ont pas été analysées
     */
    @Query("SELECT s FROM Submission s " +
           "WHERE s.project.id = :projectId " +
           "AND NOT EXISTS (SELECT a FROM Analysis a WHERE a.submission = s)")
    List<Submission> findUnanalyzedSubmissionsByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Trouve les soumissions avec leurs analyses
     */
    @Query("SELECT s FROM Submission s " +
           "LEFT JOIN FETCH s.analysis " +
           "WHERE s.id = :id")
    Optional<Submission> findSubmissionWithAnalysisById(@Param("id") Long id);
    
    // ===== Statistiques =====
    
    /**
     * Compte les soumissions par projet (avec projection)
     */
    @Query("SELECT s.project.id, COUNT(s) FROM Submission s " +
           "GROUP BY s.project.id")
    List<Object[]> countSubmissionsByProject();
    
    /**
     * Compte les soumissions par utilisateur
     */
    @Query("SELECT s.user.id, COUNT(s) FROM Submission s " +
           "GROUP BY s.user.id")
    List<Object[]> countSubmissionsByUser();
    
    /**
     * Compte les soumissions entre deux dates
     */
    long countBySubmissionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // ===== Méthodes de suppression =====
    
    /**
     * Supprime toutes les soumissions d'un utilisateur
     */
    @Modifying
    @Query("DELETE FROM Submission s WHERE s.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    
    /**
     * Supprime toutes les soumissions d'un projet
     */
    @Modifying
    @Query("DELETE FROM Submission s WHERE s.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Supprime les soumissions avant une certaine date
     */
    @Modifying
    @Query("DELETE FROM Submission s WHERE s.submissionDate < :date")
    void deleteBySubmissionDateBefore(@Param("date") LocalDateTime date);
    
    // ===== Méthodes de mise à jour =====
    
    /**
     * Met à jour l'URL GitHub d'une soumission
     */
    @Modifying
    @Query("UPDATE Submission s SET s.githubUrl = :githubUrl WHERE s.id = :id")
    int updateGithubUrl(@Param("id") Long id, @Param("githubUrl") String githubUrl);
    
    /**
     * Met à jour l'explication d'une soumission
     */
    @Modifying
    @Query("UPDATE Submission s SET s.explanation = :explanation WHERE s.id = :id")
    int updateExplanation(@Param("id") Long id, @Param("explanation") String explanation);
}