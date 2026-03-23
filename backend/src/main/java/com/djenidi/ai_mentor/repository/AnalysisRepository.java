package com.djenidi.ai_mentor.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.Analysis;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    
    // ===== Méthodes de base =====
    
    /**
     * Trouve une analyse par ID de soumission
     * Note: Correction du paramètre "subnissionId" -> "submissionId"
     */
    Optional<Analysis> findBySubmissionId(Long submissionId);
    
    // ===== Méthodes de recherche supplémentaires =====
    
    /**
     * Vérifie si une soumission a une analyse
     */
    boolean existsBySubmissionId(Long submissionId);
    
    /**
     * Trouve toutes les analyses d'un utilisateur (via ses soumissions)
     */
    @Query("SELECT a FROM Analysis a WHERE a.submission.user.id = :userId")
    List<Analysis> findByUserId(@Param("userId") Long userId);
    
    /**
     * Trouve toutes les analyses d'un projet (via ses soumissions)
     */
    @Query("SELECT a FROM Analysis a WHERE a.submission.project.id = :projectId")
    List<Analysis> findByProjectId(@Param("projectId") Long projectId);
    
    // ===== Méthodes de tri =====
    
    /**
     * Trouve les analyses triées par score (du plus élevé au plus bas)
     */
    List<Analysis> findAllByOrderByOverallScoreDesc();
    
    /**
     * Trouve les analyses triées par date (plus récentes d'abord)
     */
    List<Analysis> findAllByOrderByAnalysisDateDesc();
    
    /**
     * Trouve les analyses d'un utilisateur triées par date
     */
    @Query("SELECT a FROM Analysis a WHERE a.submission.user.id = :userId ORDER BY a.analysisDate DESC")
    List<Analysis> findByUserIdOrderByAnalysisDateDesc(@Param("userId") Long userId);
    
    // ===== Recherche par score =====
    
    /**
     * Trouve les analyses avec un score supérieur à un seuil
     */
    List<Analysis> findByOverallScoreGreaterThan(Float score);
    
    /**
     * Trouve les analyses avec un score inférieur à un seuil
     */
    List<Analysis> findByOverallScoreLessThan(Float score);
    
    /**
     * Trouve les analyses avec un score entre deux valeurs
     */
    List<Analysis> findByOverallScoreBetween(Float minScore, Float maxScore);
    
    /**
     * Trouve les analyses avec un score supérieur à un seuil, triées par score
     */
    List<Analysis> findByOverallScoreGreaterThanOrderByOverallScoreDesc(Float score);
    
    // ===== Recherche par date =====
    
    /**
     * Trouve les analyses après une certaine date
     */
    List<Analysis> findByAnalysisDateAfter(LocalDateTime date);
    
    /**
     * Trouve les analyses avant une certaine date
     */
    List<Analysis> findByAnalysisDateBefore(LocalDateTime date);
    
    /**
     * Trouve les analyses entre deux dates
     */
    List<Analysis> findByAnalysisDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Trouve les analyses récentes (derniers N jours)
     */
    @Query("SELECT a FROM Analysis a WHERE a.analysisDate >= :date ORDER BY a.analysisDate DESC")
    List<Analysis> findRecentAnalyses(@Param("date") LocalDateTime date);
    
    // ===== Recherche avec fetch join (évitent les N+1 queries) =====
    
    /**
     * Trouve une analyse avec sa soumission, son utilisateur et son projet
     */
    @Query("SELECT a FROM Analysis a " +
           "LEFT JOIN FETCH a.submission s " +
           "LEFT JOIN FETCH s.user " +
           "LEFT JOIN FETCH s.project " +
           "WHERE a.id = :id")
    Optional<Analysis> findAnalysisWithDetailsById(@Param("id") Long id);
    
    /**
     * Trouve une analyse par soumission avec tous les détails
     */
    @Query("SELECT a FROM Analysis a " +
           "LEFT JOIN FETCH a.submission s " +
           "LEFT JOIN FETCH s.user " +
           "LEFT JOIN FETCH s.project " +
           "WHERE a.submission.id = :submissionId")
    Optional<Analysis> findAnalysisBySubmissionWithDetails(@Param("submissionId") Long submissionId);
    
    /**
     * Trouve toutes les analyses avec leurs soumissions et résultats de tâches
     */
    @Query("SELECT DISTINCT a FROM Analysis a " +
           "LEFT JOIN FETCH a.submission " +
           "LEFT JOIN FETCH a.taskResults " +
           "ORDER BY a.analysisDate DESC")
    List<Analysis> findAllAnalysesWithDetails();
    
    /**
     * Trouve une analyse avec ses résultats de tâches
     */
    @Query("SELECT a FROM Analysis a " +
           "LEFT JOIN FETCH a.taskResults tr " +
           "LEFT JOIN FETCH tr.task " +
           "WHERE a.id = :id")
    Optional<Analysis> findAnalysisWithTaskResultsById(@Param("id") Long id);
    
    // ===== Statistiques =====
    
    /**
     * Calcule le score moyen des analyses
     */
    @Query("SELECT AVG(a.overallScore) FROM Analysis a")
    Double getAverageOverallScore();
    
    /**
     * Calcule le score moyen par projet
     */
    @Query("SELECT a.submission.project.id, AVG(a.overallScore) FROM Analysis a " +
           "GROUP BY a.submission.project.id")
    List<Object[]> getAverageScoreByProject();
    
    /**
     * Calcule le score moyen par utilisateur
     */
    @Query("SELECT a.submission.user.id, AVG(a.overallScore) FROM Analysis a " +
           "GROUP BY a.submission.user.id")
    List<Object[]> getAverageScoreByUser();
    
    /**
     * Compte les analyses par seuil de score
     */
    @Query("SELECT COUNT(a) FROM Analysis a WHERE a.overallScore >= :threshold")
    long countByScoreThreshold(@Param("threshold") Float threshold);
    
    /**
     * Trouve les meilleures analyses (top N par score)
     */
    List<Analysis> findTopNByOrderByOverallScoreDesc(org.springframework.data.domain.Pageable pageable);
    
    // ===== Recherche avancée =====
    
    /**
     * Recherche avancée avec critères multiples
     */
    @Query("SELECT a FROM Analysis a WHERE " +
           "(:minScore IS NULL OR a.overallScore >= :minScore) AND " +
           "(:maxScore IS NULL OR a.overallScore <= :maxScore) AND " +
           "(:startDate IS NULL OR a.analysisDate >= :startDate) AND " +
           "(:endDate IS NULL OR a.analysisDate <= :endDate)")
    List<Analysis> advancedSearch(@Param("minScore") Float minScore,
                                   @Param("maxScore") Float maxScore,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);
    
    /**
     * Recherche par texte dans le rapport
     */
    List<Analysis> findByReportTextContaining(String keyword);
    
    // ===== Méthodes de suppression =====
    
    /**
     * Supprime une analyse par ID de soumission
     */
    @Modifying
    @Query("DELETE FROM Analysis a WHERE a.submission.id = :submissionId")
    void deleteBySubmissionId(@Param("submissionId") Long submissionId);
    
    /**
     * Supprime les analyses avant une certaine date
     */
    @Modifying
    @Query("DELETE FROM Analysis a WHERE a.analysisDate < :date")
    void deleteByAnalysisDateBefore(@Param("date") LocalDateTime date);
    
    /**
     * Supprime les analyses avec un score inférieur à un seuil
     */
    @Modifying
    @Query("DELETE FROM Analysis a WHERE a.overallScore < :score")
    void deleteByOverallScoreLessThan(@Param("score") Float score);
    
    // ===== Méthodes de mise à jour =====
    
    /**
     * Met à jour le score d'une analyse
     */
    @Modifying
    @Query("UPDATE Analysis a SET a.overallScore = :score WHERE a.id = :id")
    int updateOverallScore(@Param("id") Long id, @Param("score") Float score);
    
    /**
     * Met à jour le rapport d'une analyse
     */
    @Modifying
    @Query("UPDATE Analysis a SET a.reportText = :reportText WHERE a.id = :id")
    int updateReportText(@Param("id") Long id, @Param("reportText") String reportText);
}
