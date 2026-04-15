package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.request.AnalyzeSubmissionRequest;
import com.djenidi.ai_mentor.dto.response.AnalysisResultResponse;
import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.entity.Submission;                  
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.service.AnalysisService;
import com.djenidi.ai_mentor.service.GitHubService;                 
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('USER')")
public class AnalysisController {

    private final AnalysisService analysisService;
    private final GitHubService gitHubService;
    private final SubmissionRepository submissionRepository;

    @PostMapping("/submission")
    public ResponseEntity<ApiResponse<AnalysisResultResponse>> analyzeSubmission(
            @Valid @RequestBody AnalyzeSubmissionRequest request) {
        AnalysisResultResponse result = analysisService.analyzeSubmission(request.getSubmissionId());
        return ResponseEntity.ok(ApiResponse.success("Analyse demarree", result));
    }

    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<ApiResponse<AnalysisResultResponse>> getAnalysisResult(
            @PathVariable Long submissionId) {
        AnalysisResultResponse result = analysisService.getAnalysisResult(submissionId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/submission/{submissionId}/repository")
    public ResponseEntity<ApiResponse<RepositoryContentResponse>> getRepositoryContent(
            @PathVariable Long submissionId) {
        
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));
        
        if (submission.getGithubUrl() == null) {
            throw new IllegalStateException("Cette soumission n'a pas d'URL GitHub");
        }
        
        RepositoryContentResponse content = gitHubService.fetchRepositoryContent(submission.getGithubUrl());
        return ResponseEntity.ok(ApiResponse.success(content));
    }
}
