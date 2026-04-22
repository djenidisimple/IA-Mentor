package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.request.StartChallengeRequest;
import com.djenidi.ai_mentor.dto.request.SubmitChallengeRequest;
import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.SubmissionResponse;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.service.SubmissionService;
import com.djenidi.ai_mentor.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('USER')")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserService userService;

    /**
     * Helper pour extraire l'utilisateur du token
     */
    private User getUserFromAuthHeader(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return userService.getUserFromToken(token);
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<SubmissionResponse>> startChallenge(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody StartChallengeRequest request) {
        
        User user = getUserFromAuthHeader(authHeader);
        
        try {
            SubmissionResponse submission = submissionService.startChallenge(user.getId(), request.getChallengeId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Challenge démarré ! Bonne chance", submission));
        } catch (IllegalStateException e) {
            return ResponseEntity.ok()
                    .body(ApiResponse.success(e.getMessage(), null));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitChallenge(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody SubmitChallengeRequest request) {
        
        User user = getUserFromAuthHeader(authHeader);
        
        try {
            SubmissionResponse submission = submissionService.submitChallenge(
                    user.getId(), 
                    request.getChallengeId(), 
                    request.getGithubUrl());
            return ResponseEntity.ok(
                    ApiResponse.success("Challenge soumis ! L'IA va analyser votre code", submission));
        } catch (IllegalStateException e) {
            return ResponseEntity.ok()
                    .body(ApiResponse.success(e.getMessage(), null));
        }
    }

    @GetMapping("/user/me")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMyActivity(
            @RequestHeader("Authorization") String authHeader) {  // CORRIGÉ
        
        User user = getUserFromAuthHeader(authHeader);
        List<SubmissionResponse> activity = submissionService.getUserActivity(user.getId());
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    @GetMapping("/user/me/in-progress")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMyInProgress(
            @RequestHeader("Authorization") String authHeader) {  // CORRIGÉ
        
        User user = getUserFromAuthHeader(authHeader);
        List<SubmissionResponse> inProgress = submissionService.getUserChallengesInProgress(user.getId());
        return ResponseEntity.ok(ApiResponse.success(inProgress));
    }

    @GetMapping("/user/me/completed")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMyCompleted(
            @RequestHeader("Authorization") String authHeader) {  // CORRIGÉ
        
        User user = getUserFromAuthHeader(authHeader);
        List<SubmissionResponse> completed = submissionService.getUserChallengesCompleted(user.getId());
        return ResponseEntity.ok(ApiResponse.success(completed));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmission(@PathVariable Long id) {
        SubmissionResponse submission = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(ApiResponse.success(submission));
    }
    @GetMapping("/completed")
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getAllCompletedSubmissions() {
        List<SubmissionResponse> completed = submissionService.getAllCompletedSubmissions();
        return ResponseEntity.ok(ApiResponse.success(completed));
    }
}