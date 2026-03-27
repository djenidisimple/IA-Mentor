package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.request.StartChallengeRequest;
import com.djenidi.ai_mentor.dto.request.SubmitChallengeRequest;
import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.SubmissionResponse;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<SubmissionResponse>> startChallenge(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody StartChallengeRequest request) {
        SubmissionResponse submission = submissionService.startChallenge(user.getId(), request.getChallengeId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Challenge démarré ! Bonne chance 🚀", submission));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitChallenge(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SubmitChallengeRequest request) {
        SubmissionResponse submission = submissionService.submitChallenge(
                user.getId(), request.getChallengeId(), request.getGithubUrl());
        return ResponseEntity.ok(
                ApiResponse.success("Challenge soumis ! L'IA va analyser votre code 🤖", submission));
    }

    @GetMapping("/user/me")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMyActivity(
            @AuthenticationPrincipal User user) {
        List<SubmissionResponse> activity = submissionService.getUserActivity(user.getId());
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    @GetMapping("/user/me/in-progress")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMyInProgress(
            @AuthenticationPrincipal User user) {
        List<SubmissionResponse> inProgress = submissionService.getUserChallengesInProgress(user.getId());
        return ResponseEntity.ok(ApiResponse.success(inProgress));
    }

    @GetMapping("/user/me/completed")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMyCompleted(
            @AuthenticationPrincipal User user) {
        List<SubmissionResponse> completed = submissionService.getUserChallengesCompleted(user.getId());
        return ResponseEntity.ok(ApiResponse.success(completed));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmission(@PathVariable Long id) {
        SubmissionResponse submission = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(ApiResponse.success(submission));
    }
}
