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

import java.util.*;
import java.time.LocalDateTime;
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

        return submission.getComments().stream()
                .map(comment -> new CommentDTO(
                        comment.getId(),
                        comment.getContent(),
                        new UserSummaryDTO(
                                comment.getUser().getId(),
                                comment.getUser().getUsername(),
                                comment.getUser().getAvatarUrl()
                        ),
                        0L,
                        comment.getCreatedAt()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostDTO> getCommunityFeed() {
        List<Submission> subs = submissionRepository.findAllByOrderBySubmittedAtDesc().stream()
            .filter(sub -> sub.getSubmittedAt() != null)
            .toList();
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
        String githubUrl = sub.getGithubUrl();
        String repoName = "GitHub";
        if (githubUrl != null && !githubUrl.isBlank()) {
            String[] parts = githubUrl.replace("https://github.com/", "").replace(".git", "").split("/");
            if (parts.length >= 2) {
                repoName = parts[0] + "/" + parts[1];
            }
        }

        Challenge challenge = sub.getChallenge();
        List<String> tags = challenge.getTechnologies() != null
            ? challenge.getTechnologies().stream().toList()
            : List.of();

        return PostDTO.builder()
            .id(sub.getId())
            .author(convertToSummary(sub.getUser()))
            .content("A complété le challenge : " + challenge.getTitle())
            .challengeTitle(challenge.getTitle())
            .challengeSlug(challenge.getSlug())
            .repoName(repoName)
            .githubUrl(githubUrl)
            .score(sub.getScore())
            .likes((long) sub.getLikeCount())
            .comments((long) sub.getCommentCount())
            .shares(0L)
            .tags(tags)
            .createdAt(sub.getSubmittedAt() != null ? sub.getSubmittedAt() : sub.getStartedAt())
            .isLiked(isLiked)
            .build();
    }

    public List<TrendingTopicDTO> getTrendingTopics() {
        List<Challenge> challenges = challengeRepository.findAllWithDetails();
        Map<String, Long> techCount = new LinkedHashMap<>();
        Map<String, Set<String>> techCategories = new LinkedHashMap<>();

        for (Challenge c : challenges) {
            for (String tech : c.getTechnologies()) {
                techCount.merge(tech.toLowerCase(), 1L, Long::sum);
                techCategories.computeIfAbsent(tech.toLowerCase(), k -> new LinkedHashSet<>())
                    .add(c.getType() != null ? c.getType().name() : "GENERAL");
            }
        }

        List<TrendingTopicDTO> topics = techCount.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(10)
            .map(entry -> {
                String tech = entry.getKey();
                long count = entry.getValue();
                String category = techCategories.getOrDefault(tech, Set.of("GENERAL"))
                    .stream().findFirst().orElse("GENERAL");
                String displayCategory = switch (category.toUpperCase()) {
                    case "FRONTEND" -> "Frontend";
                    case "BACKEND" -> "Backend";
                    case "FULLSTACK" -> "Fullstack";
                    default -> "Technologie";
                };
                return new TrendingTopicDTO(
                    (long) tech.hashCode(),
                    tech.substring(0, 1).toUpperCase() + tech.substring(1),
                    count,
                    displayCategory
                );
            })
            .toList();

        return topics.isEmpty()
            ? List.of(
                new TrendingTopicDTO(1L, "Spring", 125, "Framework"),
                new TrendingTopicDTO(2L, "React", 89, "Frontend")
              )
            : topics;
    }

    public List<UserSummaryDTO> getUserSuggestions() {
        Map<Long, Long> pointsByUser = submissionRepository
            .findSubmissionStatsByStatus(SubmissionStatus.REVIEWED)
            .stream()
            .collect(Collectors.toMap(
                SubmissionRepository.SubmissionStats::getUserId,
                stats -> stats.getTotalScore() != null ? stats.getTotalScore() : 0L
            ));

        return userRepository.findAll().stream()
            .sorted(Comparator.comparingLong((User u) -> pointsByUser.getOrDefault(u.getId(), 0L)).reversed())
            .limit(5)
            .map(user -> new UserSummaryDTO(
                user.getId(),
                user.getUsername(),
                user.getAvatarUrl(),
                user.getIsPremium() != null && user.getIsPremium(),
                user.getRole() != null ? user.getRole().name() : "USER",
                pointsByUser.getOrDefault(user.getId(), 0L) + " points"
            ))
            .toList();
    }
    private UserSummaryDTO convertToSummary(User user) {
        return new UserSummaryDTO(
            user.getId(), 
            user.getUsername(), 
            user.getAvatarUrl(),
            user.getIsPremium() != null && user.getIsPremium(),
            user.getRole() != null ? user.getRole().name() : "USER",
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
        User managedUser = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));
        
        managedUser.getFollowing().add(toFollow);
        userRepository.save(managedUser);
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
        return new CommentDTO(
            saved.getId(),
            saved.getContent(),
            new UserSummaryDTO(user.getId(), user.getUsername(), user.getAvatarUrl()),
            0L,
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
