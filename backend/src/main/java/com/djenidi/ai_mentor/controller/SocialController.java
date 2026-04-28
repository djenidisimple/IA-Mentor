package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.*;
import com.djenidi.ai_mentor.entity.Comment;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.djenidi.ai_mentor.dto.request.CommentRequest;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_USER')")
public class SocialController {

    private final SocialService socialService;

    @GetMapping("/posts")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<PostDTO>> getFeed() {
        return ResponseEntity.ok(socialService.getCommunityFeed());
    }

    @GetMapping("/trending")
    public ResponseEntity<List<TrendingTopicDTO>> getTrending() {
        return ResponseEntity.ok(socialService.getTrendingTopics());
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserSummaryDTO>> getSuggestions() {
        return ResponseEntity.ok(socialService.getUserSuggestions());
    }

    @PostMapping("/like/{submissionId}")
    public ResponseEntity<LikeResponseDTO> toggleLike(
            @AuthenticationPrincipal User user, 
            @PathVariable Long submissionId) {
        LikeResponseDTO response = socialService.toggleLike(user, submissionId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/follow/{userId}")
    public ResponseEntity<Void> follow(@AuthenticationPrincipal User user, @PathVariable Long userId) {
        socialService.followUser(user, userId);
        return ResponseEntity.ok().build();
    }

    // Commenter une soumission (pour le système social)
    @PostMapping("/comment/submission/{submissionId}")
    public ResponseEntity<CommentDTO> addCommentToSubmission(
            @AuthenticationPrincipal User user, 
            @PathVariable Long submissionId, 
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(socialService.addCommentToSubmission(user, submissionId, request.content()));
    }

    @GetMapping("/comments/submission/{submissionId}")
    public ResponseEntity<List<CommentDTO>> getCommentsForSubmission(@PathVariable Long submissionId) {
        return ResponseEntity.ok(socialService.getCommentsForSubmission(submissionId));
    }

    // Commenter un challenge (existant)
    @PostMapping("/comment/challenge/{challengeId}")
    public ResponseEntity<CommentDTO> addCommentToChallenge(
            @AuthenticationPrincipal User user, 
            @PathVariable Long challengeId, 
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(socialService.addCommentToChallenge(user, challengeId, request.content()));
    }
}