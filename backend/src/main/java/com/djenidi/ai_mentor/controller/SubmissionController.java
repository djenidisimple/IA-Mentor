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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_USER')")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserService userService;

    // Helper pour extraire l'utilisateur authentifié du SecurityContext
    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // Il est préférable de lancer une exception plus spécifique ici, mais AccessDeniedException est suffisant pour le moment.
            throw new AccessDeniedException("User not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else if (principal instanceof UserDetails) {
            // Si le principal est un UserDetails mais pas directement un User, on essaie de le récupérer par username.
            String username = ((UserDetails) principal).getUsername();
            // Il est crucial que userService.findByUsername retourne un User complet avec les bonnes autorités.
            return userService.findByUsername(username);
        } else if (principal instanceof String) {
            // Fallback si le principal est juste une chaîne de caractères (ex: username)
            return userService.findByUsername((String) principal);
        }
        // Si le principal n'est d'aucun type attendu, lancer une exception.
        throw new IllegalStateException("Unexpected principal type: " + principal.getClass().getName());
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<SubmissionResponse>> startChallenge(
            Authentication authentication,
            @Valid @RequestBody StartChallengeRequest request) {
        
        User user = getAuthenticatedUser(authentication);
        
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
            Authentication authentication,
            @Valid @RequestBody SubmitChallengeRequest request) {
        
        User user = getAuthenticatedUser(authentication);
        
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
            Authentication authentication) { 
        
        User user = getAuthenticatedUser(authentication);
        List<SubmissionResponse> activity = submissionService.getUserActivity(user.getId());
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    @GetMapping("/user/me/in-progress")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMyInProgress(
            Authentication authentication) { 
        
        User user = getAuthenticatedUser(authentication);
        List<SubmissionResponse> inProgress = submissionService.getUserChallengesInProgress(user.getId());
        return ResponseEntity.ok(ApiResponse.success(inProgress));
    }

    @GetMapping("/user/me/completed")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMyCompleted(
            Authentication authentication) { 
        
        User user = getAuthenticatedUser(authentication);
        List<SubmissionResponse> completed = submissionService.getUserChallengesCompleted(user.getId());
        return ResponseEntity.ok(ApiResponse.success(completed));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubmissionResponse>> getSubmission(@PathVariable Long id) {
        SubmissionResponse submission = submissionService.getSubmissionById(id);
        return ResponseEntity.ok(ApiResponse.success(submission));
    }
    @GetMapping("/completed")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getAllCompletedSubmissions() {
        List<SubmissionResponse> completed = submissionService.getAllCompletedSubmissions();
        return ResponseEntity.ok(ApiResponse.success(completed));
    }
}