package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.SubmissionResponse;
import com.djenidi.ai_mentor.entity.*;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.ChallengeRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.djenidi.ai_mentor.entity.SubmissionStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final AnalysisService analysisService;

    @Transactional
    public SubmissionResponse startChallenge(Long userId, Long challengeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", userId));

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "id", challengeId));

        Optional<Submission> existing = submissionRepository.findByUserIdAndChallengeId(userId, challengeId);
        if (existing.isPresent()) {
            throw new IllegalStateException("Vous avez déjà commencé ce challenge");
        }

        Submission submission = Submission.builder()
                .user(user)
                .challenge(challenge)
                .status(SubmissionStatus.IN_PROGRESS)
                .build();

        return toResponse(submissionRepository.save(submission));
    }

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

        Submission saved = submissionRepository.save(submission);

        try {
            analysisService.analyzeSubmission(saved.getId());
        } catch (Exception e) {
            log.warn("Impossible de déclencher l'analyse Groq pour la soumission {}: {}",
                    saved.getId(), e.getMessage());
        }

        return toResponse(saved);
    }

    public List<SubmissionResponse> getUserActivity(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Utilisateur", "id", userId);
        }
        return submissionRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SubmissionResponse> getUserChallengesInProgress(Long userId) {
        return submissionRepository.findByUserIdAndStatus(userId, SubmissionStatus.IN_PROGRESS).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<SubmissionResponse> getUserChallengesCompleted(Long userId) {
        return submissionRepository.findByUserIdAndStatus(userId, SubmissionStatus.REVIEWED).stream()
                .map(this::toResponse)
                .toList();
    }

    public SubmissionResponse getSubmissionById(Long submissionId) {
        return toResponse(submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Soumission", "id", submissionId)));
    }

    public List<SubmissionResponse> getAllSubmissions() {
        return submissionRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Récupère toutes les soumissions complétées (REVIEWED) de tous les utilisateurs
     */
    public List<SubmissionResponse> getAllCompletedSubmissions() {
        List<Submission> completedSubmissions = submissionRepository.findByStatus(SubmissionStatus.REVIEWED);
        return completedSubmissions.stream()
                .map(this::toResponse)  // ← CORRIGÉ : utilise toResponse qui existe déjà
                .collect(Collectors.toList());
    }

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