package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.LeaderboardEntryDTO;
import com.djenidi.ai_mentor.entity.Submission;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaderboardService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public List<LeaderboardEntryDTO> getLeaderboard() {
        List<User> users = userRepository.findAllByOrderByPointsDesc();
        List<LeaderboardEntryDTO> entries = new ArrayList<>();
        int rank = 1;

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);

            if (i > 0 && users.get(i - 1).getPoints() > user.getPoints()) {
                rank = i + 1;
            }

            long completed = submissionRepository.countByUserIdAndStatus(user.getId(), SubmissionStatus.REVIEWED);
            double avgScore = calculateAverageScore(user.getId());

            entries.add(LeaderboardEntryDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .points(user.getPoints())
                .rank(rank)
                .previousRank(null)
                .challengesCompleted(completed)
                .averageScore(avgScore)
                .isPremium(user.getIsPremium() != null && user.getIsPremium())
                .build());
        }

        return entries;
    }

    public LeaderboardEntryDTO getCurrentUserRank(User currentUser) {
        List<LeaderboardEntryDTO> leaderboard = getLeaderboard();
        return leaderboard.stream()
            .filter(entry -> entry.id().equals(currentUser.getId()))
            .findFirst()
            .orElse(null);
    }

    private double calculateAverageScore(Long userId) {
        List<Submission> reviewed = submissionRepository.findByUserIdAndStatus(userId, SubmissionStatus.REVIEWED);
        if (reviewed.isEmpty()) return 0.0;
        return reviewed.stream()
            .filter(s -> s.getScore() != null)
            .mapToInt(Submission::getScore)
            .average()
            .orElse(0.0);
    }
}
