package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.SubmissionResponse;
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

    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<SubmissionResponse>> reviewSubmission(@PathVariable Long id) {
        SubmissionResponse response = submissionService.reviewSubmission(id);
        return ResponseEntity.ok(ApiResponse.success("Submission reviewed", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<java.util.List<SubmissionResponse>>> listAll() {
        java.util.List<SubmissionResponse> all = submissionService.getAllSubmissions();
        return ResponseEntity.ok(ApiResponse.success(all));
    }
}
