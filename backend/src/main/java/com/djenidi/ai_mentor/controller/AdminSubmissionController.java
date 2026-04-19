package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.AnalysisResultResponse;
import com.djenidi.ai_mentor.dto.response.SubmissionResponse;
import com.djenidi.ai_mentor.service.AnalysisService;
import com.djenidi.ai_mentor.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/submissions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSubmissionController {

    private final SubmissionService submissionService;
    private final AnalysisService analysisService;

    /**
     * ✅ DÉCLENCHER L'ANALYSE GEMINI POUR UNE SOUMISSION
     * (Normalement déclenchée automatiquement via POST /submissions/submit)
     */
    @PostMapping("/{id}/analyze")
    public ResponseEntity<ApiResponse<AnalysisResultResponse>> triggerAnalysis(@PathVariable Long id) {
        AnalysisResultResponse result = analysisService.analyzeSubmission(id);
        return ResponseEntity.ok(ApiResponse.success("Analyse Gemini déclenchée (async)", result));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<java.util.List<SubmissionResponse>>> listAll() {
        java.util.List<SubmissionResponse> all = submissionService.getAllSubmissions();
        return ResponseEntity.ok(ApiResponse.success(all));
    }
}
