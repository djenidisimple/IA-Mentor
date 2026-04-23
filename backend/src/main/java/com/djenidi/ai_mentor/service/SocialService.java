package com.djenidi.ai_mentor.service;
import com.djenidi.ai_mentor.entity.*;
import com.djenidi.ai_mentor.repository.*;
import com.djenidi.ai_mentor.dto.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import com.djenidi.ai_mentor.dto.CommentDTO;
import com.djenidi.ai_mentor.dto.UserSummaryDTO;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SocialService {
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final SubmissionLikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final ChallengeRepository challengeRepository;

    // Récupère l'utilisateur connecté depuis SecurityContext
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }
        return null;
    }

    @Transactional(readOnly = true)
    public List<PostDTO> getCommunityFeed() {
        List<Submission> subs = submissionRepository.findAllByOrderBySubmittedAtDesc();
        if (subs.isEmpty()) return new ArrayList<>();
        
        User currentUser = getCurrentUser();
        return subs.stream().map(sub -> mapToDTO(sub, currentUser)).toList();
    }

    private PostDTO mapToDTO(Submission sub, User currentUser) {
        boolean isLiked = currentUser != null && 
            likeRepository.findByUserAndSubmission(currentUser, sub).isPresent();
        
        return new PostDTO(
            sub.getId(),
            convertToSummary(sub.getUser()),
            "A complété le challenge : " + sub.getChallenge().getTitle(),
            new CodeSnippetDTO("GitHub", sub.getGithubUrl()),
            new ArrayList<>(),
            (long) sub.getLikeCount(),
            (long) sub.getCommentCount(),
            0L,
            sub.getSubmittedAt() != null ? sub.getSubmittedAt() : sub.getStartedAt(),
            isLiked
        );
    }

    public List<TrendingTopicDTO> getTrendingTopics() {
        return List.of(
            new TrendingTopicDTO(1L, "Spring", 125, "Framework"),
            new TrendingTopicDTO(2L, "React", 89, "Frontend")
        );
    }

    public List<UserSummaryDTO> getUserSuggestions() {
        return userRepository.findTop5ByOrderByUsernameAsc().stream()
            .map(this::convertToSummary)
            .toList();
    }

    private UserSummaryDTO convertToSummary(User user) {
        return new UserSummaryDTO(
            user.getId(), 
            user.getUsername(), 
            user.getAvatarUrl(),
            false,              
            "Developer",
            null                 
        );
    }

    // --- LIKES ---
    @Transactional
    public void toggleLike(User user, Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Soumission non trouvée"));

        likeRepository.findByUserAndSubmission(user, submission)
            .ifPresentOrElse(
                likeRepository::delete,
                () -> likeRepository.save(SubmissionLike.builder().user(user).submission(submission).build())
            );
    }

    // --- FOLLOW ---
    @Transactional
    public void followUser(User currentUser, Long userToFollowId) {
        if (currentUser.getId().equals(userToFollowId)) {
            throw new IllegalArgumentException("Vous ne pouvez pas vous suivre vous-même");
        }
        User toFollow = userRepository.findById(userToFollowId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        
        currentUser.getFollowing().add(toFollow);
        userRepository.save(currentUser);
    }

    // --- COMMENTAIRES ---
    @Transactional
    public CommentDTO addCommentToSubmission(User user, Long submissionId, String content) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Soumission non trouvée"));
        
        Comment comment = Comment.builder()
                .content(content)
                .user(user)
                .submission(submission)
                .build();
                
        Comment saved = commentRepository.save(comment);

        return new CommentDTO(
            saved.getId(),
            saved.getContent(),
            new UserSummaryDTO(user.getId(), user.getUsername(), user.getAvatarUrl()),
            saved.getCreatedAt()
        );
    }

    @Transactional
    public CommentDTO addCommentToChallenge(User user, Long challengeId, String content) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new EntityNotFoundException("Challenge non trouvé"));
        
        Comment comment = Comment.builder()
                .content(content)
                .user(user)
                .challenge(challenge)
                .build();
                
        Comment saved = commentRepository.save(comment);

        return new CommentDTO(
            saved.getId(),
            saved.getContent(),
            new UserSummaryDTO(user.getId(), user.getUsername(), user.getAvatarUrl()),
            saved.getCreatedAt()
        );
    }
}
