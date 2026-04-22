package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.*;
import com.djenidi.ai_mentor.entity.Comment;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialController {

    private final SocialService socialService;

    @GetMapping("/posts")
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

    // Liker une soumission : POST /api/social/like/5
    @PostMapping("/like/{submissionId}")
    public ResponseEntity<Void> toggleLike(@AuthenticationPrincipal User user, @PathVariable Long submissionId) {
        socialService.toggleLike(user, submissionId);
        return ResponseEntity.ok().build();
    }

    // Suivre un utilisateur : POST /api/social/follow/10
    @PostMapping("/follow/{userId}")
    public ResponseEntity<Void> follow(@AuthenticationPrincipal User user, @PathVariable Long userId) {
        socialService.followUser(user, userId);
        return ResponseEntity.ok().build();
    }

    // Commenter un challenge : POST /api/social/comment/3
    @PostMapping("/comment/{challengeId}")
    public ResponseEntity<CommentDTO> addComment(
            @AuthenticationPrincipal User user, 
            @PathVariable Long challengeId, 
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(socialService.addComment(user, challengeId, request.content()));
    }
}