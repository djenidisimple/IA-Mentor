package com.djenidi.ai_mentor.repository;

import com.djenidi.ai_mentor.entity.Submission;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Toutes les soumissions d'un utilisateur
    List<Submission> findByUserId(Long userId);

    // Filtrer par statut (ex: challenges en cours, terminés)
    List<Submission> findByUserIdAndStatus(Long userId, SubmissionStatus status);

    // Vérifier si un utilisateur a déjà commencé un challenge donné
    Optional<Submission> findByUserIdAndChallengeId(Long userId, Long challengeId);

    // Compter les challenges terminés par un utilisateur
    long countByUserIdAndStatus(Long userId, SubmissionStatus status);

    // Toutes les soumissions pour un challenge donné
    List<Submission> findByChallengeId(Long challengeId);

    List<Submission> findByStatus(SubmissionStatus status);

    @Query("SELECT s FROM Submission s JOIN FETCH s.user JOIN FETCH s.challenge ORDER BY s.submittedAt DESC")

    List<Submission> findAllByOrderBySubmittedAtDesc();

    @Query("SELECT s.challenge.id AS challengeId, AVG(s.score) AS avgScore FROM Submission s " +
           "WHERE s.status = :status GROUP BY s.challenge.id")
    List<ChallengeAverageScore> findAverageScoreByStatus(@Param("status") SubmissionStatus status);

    interface ChallengeAverageScore {
        Long getChallengeId();
        Double getAvgScore();
    }

    @Query("SELECT s.user.id AS userId, COUNT(s) AS completed, AVG(s.score) AS avgScore, COALESCE(SUM(s.score), 0) AS totalScore " +
           "FROM Submission s WHERE s.status = :status GROUP BY s.user.id")
    List<SubmissionStats> findSubmissionStatsByStatus(@Param("status") SubmissionStatus status);

    interface SubmissionStats {
        Long getUserId();
        Long getCompleted();
        Double getAvgScore();
        Long getTotalScore();
    }
}
