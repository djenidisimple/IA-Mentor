package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.AnalysisResultResponse;
import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.entity.Analysis;
import com.djenidi.ai_mentor.entity.AnalysisStatus;
import com.djenidi.ai_mentor.entity.Submission;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.AnalysisRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import com.djenidi.ai_mentor.entity.Challenge;
import com.djenidi.ai_mentor.repository.ChallengeRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class AnalysisService {

    private final AnalysisRepository analysisRepository;
    private final SubmissionRepository submissionRepository;
    private final GitHubService gitHubService;
    private final AIService aiService;
    private final ApplicationContext applicationContext;
    private final ObjectMapper objectMapper;
    private final ChallengeRepository challengeRepository; 

    // ✅ FIX 1 : constructeur manuel pour que @Qualifier soit respecté
    public AnalysisService(
            AnalysisRepository analysisRepository,
            SubmissionRepository submissionRepository,
            GitHubService gitHubService,
            @Qualifier("groqService") AIService aiService,
            ApplicationContext applicationContext,
            ObjectMapper objectMapper,
            ChallengeRepository challengeRepository
    ) {
        this.analysisRepository = analysisRepository;
        this.submissionRepository = submissionRepository;
        this.gitHubService = gitHubService;
        this.aiService = aiService;
        this.applicationContext = applicationContext;
        this.objectMapper = objectMapper;
        this.challengeRepository = challengeRepository;
    }

    @Transactional
    public AnalysisResultResponse analyzeSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        if (submission.getGithubUrl() == null) {
            throw new IllegalStateException("Cette soumission n'a pas d'URL GitHub");
        }

        Analysis existingAnalysis = analysisRepository.findBySubmissionId(submissionId).orElse(null);

        if (existingAnalysis != null && existingAnalysis.getStatus() == AnalysisStatus.COMPLETED) {
            return mapToResponse(existingAnalysis);
        }

        Analysis analysis = existingAnalysis != null ? existingAnalysis : createNewAnalysis(submission);

        Long analysisId = analysis.getId();
        String githubUrl = submission.getGithubUrl();

        // ✅ FIX 2 : extrait l'ID du challenge pendant la transaction
        // pour recharger l'entité proprement dans le thread async
        Long challengeId = submission.getChallenge() != null
                ? submission.getChallenge().getId()
                : null;

        Runnable trigger = () -> applicationContext.getBean(AnalysisService.class)
                .triggerAsyncAnalysis(analysisId, githubUrl, challengeId);

        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    trigger.run();
                }
            });
        } else {
            trigger.run();
        }

        return mapToResponse(analysis);
    }

    // ✅ Nouvelle méthode : logique déplacée depuis le controller
    public RepositoryContentResponse getRepositoryContent(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        if (submission.getGithubUrl() == null) {
            throw new IllegalStateException("Cette soumission n'a pas d'URL GitHub");
        }

        return gitHubService.fetchRepositoryContent(submission.getGithubUrl());
    }

    private Analysis createNewAnalysis(Submission submission) {
        Analysis analysis = Analysis.builder()
                .submission(submission)
                .status(AnalysisStatus.PENDING)
                .build();
        return analysisRepository.save(analysis);
    }

    @Async("asyncExecutor")
    @Transactional
    public void triggerAsyncAnalysis(Long analysisId, String githubUrl, Long challengeId) {
        try {
            log.info("🔥 triggerAsyncAnalysis DÉMARRÉ analysisId={}", analysisId);

            Analysis managed = analysisRepository.findById(analysisId)
                    .orElseThrow(() -> new ResourceNotFoundException("Analysis", "id", analysisId));

            managed.setStatus(AnalysisStatus.FETCHING);
            analysisRepository.save(managed);

            RepositoryContentResponse repoContent = gitHubService.fetchRepositoryContent(githubUrl);
            log.info("📁 {} fichiers récupérés", repoContent.getFiles().size());

            managed.setStatus(AnalysisStatus.ANALYZING);
            analysisRepository.save(managed);

            // ✅ FIX 2 : recharge le Challenge dans cette transaction
            Challenge challenge = challengeId != null
                    ? challengeRepository.findById(challengeId).orElse(null)
                    : null;

            AIService.AIAnalysisResult aiResult = aiService.analyzeRepository(repoContent, challenge);
            log.info("✅ Groq a répondu — score={}", aiResult.score());

            managed.setSummary(aiResult.summary());
            managed.setDetailedFeedback(aiResult.detailedFeedback());
            managed.setScore(aiResult.score());
            managed.setStrengths(aiResult.strengths());
            managed.setWeaknesses(aiResult.weaknesses());
            managed.setSuggestions(aiResult.suggestions());
            managed.setCodeQualityMetrics(aiResult.codeQualityMetrics());
            managed.setStatus(AnalysisStatus.COMPLETED);
            managed.setCompletedAt(LocalDateTime.now());
            analysisRepository.save(managed);

            Submission submission = managed.getSubmission();
            submission.setAiFeedback(aiResult.summary() + "\n\n" + aiResult.detailedFeedback());
            submission.setScore(aiResult.score());
            submission.setStatus(SubmissionStatus.REVIEWED);
            submission.setReviewedAt(LocalDateTime.now());
            submissionRepository.save(submission);

            log.info("✅ Analysis completed for submission {}: score={}", submission.getId(), aiResult.score());

        } catch (Exception e) {
            log.error("❌ Analysis failed for analysisId={}", analysisId, e);
            try {
                Analysis managedErr = analysisRepository.findById(analysisId).orElse(null);
                if (managedErr != null) {
                    managedErr.setStatus(AnalysisStatus.FAILED);
                    managedErr.setErrorMessage(e.getMessage());
                    analysisRepository.save(managedErr);

                    Submission submission = managedErr.getSubmission();
                    submission.setAiFeedback("Erreur lors de l'analyse: " + e.getMessage());
                    submission.setStatus(SubmissionStatus.REVIEWED);
                    submission.setReviewedAt(LocalDateTime.now());
                    submission.setScore(0);
                    submissionRepository.save(submission);
                }
            } catch (Exception inner) {
                log.error("Failed to persist error state for analysisId={}", analysisId, inner);
            }
        }
    }

    public AnalysisResultResponse getAnalysisResult(Long submissionId) {
        Analysis analysis = analysisRepository.findBySubmissionId(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis", "submissionId", submissionId));
        return mapToResponse(analysis);
    }

    private AnalysisResultResponse mapToResponse(Analysis analysis) {
        return AnalysisResultResponse.builder()
                .id(analysis.getId())
                .submissionId(analysis.getSubmission().getId())
                .summary(analysis.getSummary())
                .detailedFeedback(analysis.getDetailedFeedback())
                .score(analysis.getScore())
                .strengths(parseJsonArray(analysis.getStrengths()))
                .weaknesses(parseJsonArray(analysis.getWeaknesses()))
                .suggestions(parseJsonArray(analysis.getSuggestions()))
                .metrics(parseMetrics(analysis.getCodeQualityMetrics()))
                .status(analysis.getStatus().name())
                .createdAt(analysis.getCreatedAt())
                .completedAt(analysis.getCompletedAt())
                .build();
    }

    private AnalysisResultResponse.CodeQualityMetrics parseMetrics(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, AnalysisResultResponse.CodeQualityMetrics.class);
        } catch (Exception e) {
            log.warn("Impossible de parser les métriques: {}", json);
            return null;
        }
    }

    // ✅ FIX 2 : parsing JSON robuste avec Jackson
    private List<String> parseJsonArray(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("Impossible de parser le JSON array: {}", json);
            return List.of();
        }
    }
}
