package com.djenidi.ai_mentor.repository;

import com.djenidi.ai_mentor.entity.Submission;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

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
}
