package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.SubmissionResponse;
import com.djenidi.ai_mentor.entity.*;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.exception.DuplicateResourceException;
import com.djenidi.ai_mentor.repository.ChallengeRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;
import com.djenidi.ai_mentor.entity.SubmissionStatus;

import java.time.LocalDateTime;
import java.net.URI;
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
            throw new DuplicateResourceException("Soumission", "challenge", challengeId);
        }

        Submission submission = Submission.builder()
                .user(user)
                .challenge(challenge)
                .status(SubmissionStatus.IN_PROGRESS)
                .build();

        return toResponse(submissionRepository.save(submission));
    }

    @Transactional
    public SubmissionResponse submitChallenge(Long userId, Long challengeId, String githubUrl, String comment) {
        Submission submission = submissionRepository.findByUserIdAndChallengeId(userId, challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Soumission", "challengeId", challengeId));

        String linkedGithubUsername = submission.getUser().getGithubUsername();
        if (linkedGithubUsername == null || linkedGithubUsername.isBlank()) {
            throw new AccessDeniedException("Associez votre compte GitHub avant de soumettre un depot.");
        }
        String repositoryOwner = extractGithubOwner(githubUrl);
        if (!linkedGithubUsername.equalsIgnoreCase(repositoryOwner)) {
            throw new AccessDeniedException("Le depot doit appartenir au compte GitHub associe (" +
                    linkedGithubUsername + ").");
        }

        if (submission.getStatus() == SubmissionStatus.SUBMITTED
                || submission.getStatus() == SubmissionStatus.REVIEWED) {
            throw new DuplicateResourceException("Soumission", "challenge", challengeId);
        }

        submission.setGithubUrl(githubUrl);
        submission.setUserComment(comment == null || comment.isBlank() ? null : comment.trim());
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


    private String extractGithubOwner(String githubUrl) {
        try {
            URI uri = URI.create(githubUrl);
            String[] path = uri.getPath() == null ? new String[0] : uri.getPath().split("/");
            if (!"https".equalsIgnoreCase(uri.getScheme())
                    || !"github.com".equalsIgnoreCase(uri.getHost())
                    || uri.getUserInfo() != null
                    || uri.getPort() != -1
                    || uri.getQuery() != null
                    || uri.getFragment() != null
                    || path.length < 3
                    || path.length > 4
                    || !path[0].isEmpty()
                    || path[1].isBlank()
                    || path[2].isBlank()
                    || (path.length == 4 && !path[3].isEmpty())) {
                throw new IllegalArgumentException("URL GitHub invalide. Utilisez https://github.com/login-du-compte/depot.");
            }
            String owner = path[1];
            String repository = path[2];
            if (repository.endsWith(".git")) {
                repository = repository.substring(0, repository.length() - 4);
            }
            if (!owner.matches("[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?")
                    || !repository.matches("[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?")) {
                throw new IllegalArgumentException("URL GitHub invalide. Utilisez https://github.com/login-du-compte/depot.");
            }
            return owner;
        } catch (IllegalArgumentException ex) {
            if (ex.getMessage() != null && ex.getMessage().startsWith("URL GitHub invalide")) {
                throw ex;
            }
            throw new IllegalArgumentException("URL GitHub invalide. Utilisez https://github.com/login-du-compte/depot.");
        }
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
                .comment(submission.getUserComment())
                .status(submission.getStatus())
                .aiFeedback(submission.getAiFeedback())
                .score(submission.getScore())
                .startedAt(submission.getStartedAt())
                .submittedAt(submission.getSubmittedAt())
                .reviewedAt(submission.getReviewedAt())
                .build();
    }
}
