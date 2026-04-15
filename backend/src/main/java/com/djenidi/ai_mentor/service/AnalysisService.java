package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.AnalysisResultResponse;
import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.entity.Analysis;
import com.djenidi.ai_mentor.entity.AnalysisStatus;
import com.djenidi.ai_mentor.entity.Submission;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.AnalysisRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalysisService {

    private final AnalysisRepository analysisRepository;
    private final SubmissionRepository submissionRepository;
    private final GitHubService gitHubService;
    
    @Qualifier("geminiService")
    private final AIService aiService;

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
        
        String challengeTitle = submission.getChallenge() != null ? 
                submission.getChallenge().getTitle() : "Challenge";
                
        triggerAsyncAnalysis(analysis, submission.getGithubUrl(), challengeTitle);

        return mapToResponse(analysis);
    }

    private Analysis createNewAnalysis(Submission submission) {
        Analysis analysis = Analysis.builder()
                .submission(submission)
                .status(AnalysisStatus.PENDING)
                .build();
        return analysisRepository.save(analysis);
    }

    @Async
    @Transactional
    public void triggerAsyncAnalysis(Analysis analysis, String githubUrl, String challengeContext) {
        try {
            analysis.setStatus(AnalysisStatus.FETCHING);
            analysisRepository.save(analysis);

            RepositoryContentResponse repoContent = gitHubService.fetchRepositoryContent(githubUrl);

            analysis.setStatus(AnalysisStatus.ANALYZING);
            analysisRepository.save(analysis);

            AIService.AIAnalysisResult aiResult = aiService.analyzeRepository(repoContent, challengeContext);

            analysis.setSummary(aiResult.summary());
            analysis.setDetailedFeedback(aiResult.detailedFeedback());
            analysis.setScore(aiResult.score());
            analysis.setStrengths(aiResult.strengths());
            analysis.setWeaknesses(aiResult.weaknesses());
            analysis.setSuggestions(aiResult.suggestions());
            analysis.setCodeQualityMetrics(aiResult.codeQualityMetrics());
            analysis.setStatus(AnalysisStatus.COMPLETED);
            analysis.setCompletedAt(LocalDateTime.now());

            analysisRepository.save(analysis);

        } catch (Exception e) {
            log.error("Analysis failed for submission {}", analysis.getSubmission().getId(), e);
            analysis.setStatus(AnalysisStatus.FAILED);
            analysis.setErrorMessage(e.getMessage());
            analysisRepository.save(analysis);
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
                .status(analysis.getStatus().name())
                .createdAt(analysis.getCreatedAt())
                .completedAt(analysis.getCompletedAt())
                .build();
    }

    private List<String> parseJsonArray(String json) {
        if (json == null || json.isEmpty()) return List.of();
        try {
            String cleaned = json.replace("[", "").replace("]", "").replace("\"", "");
            return Arrays.stream(cleaned.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        } catch (Exception e) {
            return List.of();
        }
    }
}
