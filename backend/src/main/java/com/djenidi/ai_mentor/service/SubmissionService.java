package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.SubmissionResponse;
import com.djenidi.ai_mentor.entity.*;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.ChallengeRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;

    /**
     * Démarrer un challenge → crée une Submission avec status IN_PROGRESS
     * C'est ici que l'activité de l'utilisateur commence !
     */
    @Transactional
    public SubmissionResponse startChallenge(Long userId, Long challengeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", userId));

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "id", challengeId));

        // Vérifier si l'utilisateur a déjà commencé ce challenge
        Optional<Submission> existing = submissionRepository.findByUserIdAndChallengeId(userId, challengeId);
        if (existing.isPresent()) {
            throw new IllegalStateException("Vous avez déjà commencé ce challenge");
        }

        Submission submission = Submission.builder()
                .user(user)
                .challenge(challenge)
                .status(SubmissionStatus.IN_PROGRESS)
                .build();

        Submission saved = submissionRepository.save(submission);
        return toResponse(saved);
    }

    /**
     * Soumettre un challenge → met à jour avec l'URL GitHub + status SUBMITTED
     */
    @Transactional
    public SubmissionResponse submitChallenge(Long userId, Long challengeId, String githubUrl) {
        Submission submission = submissionRepository.findByUserIdAndChallengeId(userId, challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Soumission", "challengeId", challengeId));

        if (submission.getStatus() == SubmissionStatus.SUBMITTED
                || submission.getStatus() == SubmissionStatus.REVIEWED) {
            throw new IllegalStateException("Ce challenge a déjà été soumis");
        }

        submission.setGithubUrl(githubUrl);
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.now());

        return toResponse(submissionRepository.save(submission));
    }

    /**
     * Récupérer toutes les activités d'un utilisateur (tous statuts)
     */
    public List<SubmissionResponse> getUserActivity(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Utilisateur", "id", userId);
        }
        return submissionRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Récupérer les challenges en cours d'un utilisateur
     */
    public List<SubmissionResponse> getUserChallengesInProgress(Long userId) {
        return submissionRepository.findByUserIdAndStatus(userId, SubmissionStatus.IN_PROGRESS).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Récupérer les challenges terminés (reviewés par l'IA)
     */
    public List<SubmissionResponse> getUserChallengesCompleted(Long userId) {
        return submissionRepository.findByUserIdAndStatus(userId, SubmissionStatus.REVIEWED).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Récupérer une soumission par son ID
     */
    public SubmissionResponse getSubmissionById(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Soumission", "id", submissionId));
        return toResponse(submission);
    }

    // === HELPER ===

    private SubmissionResponse toResponse(Submission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .userId(submission.getUser().getId())
                .username(submission.getUser().getUsername())
                .challengeId(submission.getChallenge().getId())
                .challengeTitle(submission.getChallenge().getTitle())
                .challengeSlug(submission.getChallenge().getSlug())
                .githubUrl(submission.getGithubUrl())
                .status(submission.getStatus())
                .aiFeedback(submission.getAiFeedback())
                .score(submission.getScore())
                .startedAt(submission.getStartedAt())
                .submittedAt(submission.getSubmittedAt())
                .reviewedAt(submission.getReviewedAt())
                .build();
    }
}
