package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.request.AnalyzeSubmissionRequest;
import com.djenidi.ai_mentor.dto.response.AnalysisResultResponse;
import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.service.AnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_USER')")
public class AnalysisController {

    private final AnalysisService analysisService;
    // ✅ FIX : SubmissionRepository et GitHubService supprimés du controller
    //    La logique appartient au service, pas au controller

    @PostMapping("/submission")
    public ResponseEntity<ApiResponse<AnalysisResultResponse>> analyzeSubmission(
            @Valid @RequestBody AnalyzeSubmissionRequest request) {
        AnalysisResultResponse result = analysisService.analyzeSubmission(request.getSubmissionId());
        return ResponseEntity.ok(ApiResponse.success("Analyse démarrée", result));
    }

    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<ApiResponse<AnalysisResultResponse>> getAnalysisResult(
            @PathVariable Long submissionId) {
        AnalysisResultResponse result = analysisService.getAnalysisResult(submissionId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // ✅ FIX : logique déplacée dans AnalysisService
    @GetMapping("/submission/{submissionId}/repository")
    public ResponseEntity<ApiResponse<RepositoryContentResponse>> getRepositoryContent(
            @PathVariable Long submissionId) {
        RepositoryContentResponse content = analysisService.getRepositoryContent(submissionId);
        return ResponseEntity.ok(ApiResponse.success(content));
    }
}
