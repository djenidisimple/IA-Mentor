package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.request.CreateChallengeRequest;
import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.ChallengeResponse;
import com.djenidi.ai_mentor.entity.ChallengeLevel;
import com.djenidi.ai_mentor.entity.ChallengeType;
import com.djenidi.ai_mentor.service.ChallengeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
public class ChallengeController {

    private final ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChallengeResponse>>> getAllChallenges(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ChallengeLevel level,
            @RequestParam(required = false) ChallengeType type) {

        List<ChallengeResponse> challenges;

        if (category != null) {
            challenges = challengeService.getChallengesByCategory(category);
        } else if (level != null) {
            challenges = challengeService.getChallengesByLevel(level);
        } else if (type != null) {
            challenges = challengeService.getChallengesByType(type);
        } else {
            challenges = challengeService.getAllChallenges();
        }

        return ResponseEntity.ok(ApiResponse.success(challenges));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<ChallengeResponse>> getChallengeBySlug(@PathVariable String slug) {
        ChallengeResponse challenge = challengeService.getChallengeBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(challenge));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ChallengeResponse>> createChallenge(
            @Valid @RequestBody CreateChallengeRequest request) {
        ChallengeResponse challenge = challengeService.createChallenge(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Challenge créé avec succès", challenge));
    }

    @DeleteMapping("/{slug}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteChallenge(@PathVariable String slug) {
        challengeService.deleteChallenge(slug);
        return ResponseEntity.ok(ApiResponse.success("Challenge supprimé", null));
    }

    @PostMapping("/{slug}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ChallengeResponse>> reviewChallenge(@PathVariable String slug) {
        ChallengeResponse challenge = challengeService.reviewChallenge(slug);
        return ResponseEntity.ok(ApiResponse.success("Challenge marqué comme revu", challenge));
    }
}
