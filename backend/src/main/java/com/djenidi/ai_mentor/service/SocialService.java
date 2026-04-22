package com.djenidi.ai_mentor.service;
import com.djenidi.ai_mentor.entity.*;
import com.djenidi.ai_mentor.repository.*;
import com.djenidi.ai_mentor.dto.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional(readOnly = true)
    // public List<PostDTO> getCommunityFeed() {
    //     return submissionRepository.findAllByOrderBySubmittedAtDesc().stream()
    //         .map(sub -> new PostDTO(
    //             sub.getId(),
    //             convertToSummary(sub.getUser()),
    //             "A terminé le challenge : " + sub.getChallenge().getTitle() + " avec un score de " + sub.getScore() + "/100",
    //             // URL GitHub à la place
    //             new CodeSnippetDTO("GitHub Link", sub.getGithubUrl() != null ? sub.getGithubUrl() : "No link provided"), 
    //             new ArrayList<>(),
    //             (long) sub.getLikeCount(),
    //             0L,
    //             0L, 
    //             sub.getSubmittedAt() != null ? sub.getSubmittedAt() : sub.getStartedAt(),
    //             checkIfUserLiked(sub.getId())
    //         ))
    //         .toList();
    // }

    public List<PostDTO> getCommunityFeed() {
        List<Submission> subs = submissionRepository.findAllByOrderBySubmittedAtDesc();
        if (subs.isEmpty()) return new ArrayList<>();
        return subs.stream().map(this::mapToDTO).toList();
    }

    private PostDTO mapToDTO(Submission sub) {
        return new PostDTO(
            sub.getId(),
            convertToSummary(sub.getUser()),
            "A complété le challenge : " + sub.getChallenge().getTitle(),
            new CodeSnippetDTO("GitHub", sub.getGithubUrl()),
            new ArrayList<>(), // Liste de tags vide pour l'instant
            (long) sub.getLikeCount(),
            0L, // Comments (à mapper plus tard)
            0L, // Shares
            sub.getSubmittedAt() != null ? sub.getSubmittedAt() : sub.getStartedAt(),
            false // isLiked (valeur par défaut)
        );
    }

    public List<TrendingTopicDTO> getTrendingTopics() {
        // Logique pour compter les tags les plus utilisés
        return List.of(
            new TrendingTopicDTO(1L, "Spring", 125, "Framework"),
            new TrendingTopicDTO(2L, "React", 89, "Frontend")
        );
    }

    public List<UserSummaryDTO> getUserSuggestions() {
        // On remplace findTopSuggestions() par la méthode Spring Data
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
    
    private boolean checkIfUserLiked(Long postId) {
        // Récupérer le user connecté via SecurityContextHolder et vérifier en DB
        return false; 
    }

    // --- LIKES ---
    @Transactional
    public void toggleLike(User user, Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Soumission non trouvée"));

        likeRepository.findByUserAndSubmission(user, submission)
            .ifPresentOrElse(
                likeRepository::delete, // Si existe, on supprime (unlike)
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
    // Dans SocialService.java

    @Transactional
    public CommentDTO addComment(User user, Long challengeId, String content) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new EntityNotFoundException("Challenge non trouvé"));
        
        Comment comment = Comment.builder()
                .content(content)
                .user(user)
                .challenge(challenge)
                .build();
                
        Comment saved = commentRepository.save(comment);

        // Transformation manuelle de l'entité vers le DTO
        return new CommentDTO(
            saved.getId(),
            saved.getContent(),
            new UserSummaryDTO(user.getId(), user.getUsername(), user.getAvatarUrl()),
            saved.getCreatedAt()
        );
    }
}
