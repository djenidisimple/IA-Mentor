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
import java.util.Set;
import java.util.HashSet;

import java.util.Optional;
import java.util.stream.Collectors;
import com.djenidi.ai_mentor.dto.TrendingTopicDTO;
import com.djenidi.ai_mentor.dto.PostDTO;
import com.djenidi.ai_mentor.dto.LikeResponseDTO;
import com.djenidi.ai_mentor.repository.ChallengeRepository;
import com.djenidi.ai_mentor.repository.CommentRepository;
import com.djenidi.ai_mentor.repository.SubmissionLikeRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;


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

    public List<CommentDTO> getCommentsForSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Soumission non trouvée"));
        Long likeCount = likeRepository.getLikeCountBySubmissionId(submissionId);

        return submission.getComments().stream()
                .map(comment -> new CommentDTO(
                        comment.getId(),
                        comment.getContent(),
                        new UserSummaryDTO(
                                comment.getUser().getId(),
                                comment.getUser().getUsername(),
                                comment.getUser().getAvatarUrl()
                        ),
                        likeCount,
                        comment.getCreatedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostDTO> getCommunityFeed() {
        List<Submission> subs = submissionRepository.findAllByOrderBySubmittedAtDesc();
        User currentUser = getCurrentUser();
        Set<Long> userLikeIds = new HashSet<>();
        if (currentUser != null) {
            userLikeIds = likeRepository.findAllByUser(currentUser).stream()
                .map(like -> like.getSubmission().getId())
                .collect(Collectors.toSet());
        }
        final Set<Long> finalLikes = userLikeIds;
        return subs.stream()
            .map(sub -> mapToDTO(sub, finalLikes.contains(sub.getId())))
            .toList();
    }

    private PostDTO mapToDTO(Submission sub, boolean isLiked) {
        return PostDTO.builder()
            .id(sub.getId())
            .author(convertToSummary(sub.getUser()))
            .content("A complété le challenge : " + sub.getChallenge().getTitle())
            .code(new CodeSnippetDTO("GitHub", sub.getGithubUrl()))
            .likes((long) sub.getLikeCount())
            .comments((long) sub.getCommentCount())
            .shares(0L)
            .tags(new ArrayList<>())
            .createdAt(sub.getSubmittedAt() != null ? sub.getSubmittedAt() : sub.getStartedAt())
            .isLiked(isLiked)
            .build();
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

    
    @Transactional
    public LikeResponseDTO toggleLike(User user, Long submissionId) {
        Submission sub = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new EntityNotFoundException("Soumission non trouvée"));

        boolean liked = false;
        Optional<SubmissionLike> existingLike = likeRepository.findByUserAndSubmission(user, sub);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            likeRepository.save(SubmissionLike.builder()
                    .user(user)
                    .submission(sub)
                    .build());
            liked = true;
        }

        likeRepository.flush(); 
        
        return new LikeResponseDTO(liked, (long) sub.getLikeCount());
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
                .challenge(submission.getChallenge())
                .build();
                
        Comment saved = commentRepository.save(comment);
        Long likeCount = likeRepository.getLikeCountBySubmissionId(submissionId);

        return new CommentDTO(
            saved.getId(),
            saved.getContent(),
            new UserSummaryDTO(user.getId(), user.getUsername(), user.getAvatarUrl()),
            likeCount,
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
            0L,
            saved.getCreatedAt()
        );
    }
}
