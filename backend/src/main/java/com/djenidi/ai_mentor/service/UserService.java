package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.UserProfileResponse;
import com.djenidi.ai_mentor.entity.Submission;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;
import com.djenidi.ai_mentor.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final JwtService jwtService;

    /**
     * Récupère un utilisateur à partir d'un token JWT
     */
    public User getUserFromToken(String token) {
        String username = jwtService.extractUsername(token);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "username", username));
    }

    /**
     * Récupère un utilisateur par email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", email));
    }

    /**
     * Récupère un utilisateur par nom d'utilisateur
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "username", username));
    }

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", userId));

        List<Submission> submissions = submissionRepository.findByUserId(userId);

        long inProgress = submissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.IN_PROGRESS).count();
        long submitted = submissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.SUBMITTED).count();
        long completed = submissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.REVIEWED).count();
        long total = submissions.size();

        double averageScore = submissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.REVIEWED)
                .filter(s -> s.getScore() != null)
                .mapToInt(Submission::getScore)
                .average()
                .orElse(0.0);

        int pointsEarned = submissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.REVIEWED)
                .filter(s -> s.getScore() != null)
                .mapToInt(Submission::getScore)
                .sum();

        double successRate = total == 0 ? 0.0 : completed * 100.0 / total;

        long totalTimeMinutes = submissions.stream()
                .filter(s -> s.getStatus() == SubmissionStatus.REVIEWED)
                .filter(s -> s.getStartedAt() != null && s.getReviewedAt() != null)
                .mapToLong(s -> ChronoUnit.MINUTES.between(s.getStartedAt(), s.getReviewedAt()))
                .sum();

        long activeDays = user.getCreatedAt() != null
                ? Math.max(0, ChronoUnit.DAYS.between(user.getCreatedAt().toLocalDate(), LocalDate.now()))
                : 0L;

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .points(user.getPoints())
                .pointsEarned(pointsEarned)
                .isPremium(user.getIsPremium())
                .challengesInProgress(inProgress)
                .challengesSubmitted(submitted)
                .challengesCompleted(completed)
                .totalChallenges(total)
                .averageScore(Math.round(averageScore * 10.0) / 10.0)
                .successRate(Math.round(successRate * 10.0) / 10.0)
                .totalTimeMinutes(totalTimeMinutes)
                .activeDays(activeDays)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
