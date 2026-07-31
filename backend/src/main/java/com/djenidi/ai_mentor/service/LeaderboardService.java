package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.LeaderboardEntryDTO;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository.SubmissionStats;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LeaderboardService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public List<LeaderboardEntryDTO> getLeaderboard() {
        List<User> users = userRepository.findAll();
        Map<Long, SubmissionStats> statsByUser = submissionRepository
            .findSubmissionStatsByStatus(SubmissionStatus.REVIEWED)
            .stream()
            .collect(Collectors.toMap(SubmissionStats::getUserId, s -> s));

        List<User> sorted = new ArrayList<>(users);
        sorted.sort(Comparator.comparingInt((User u) -> pointsOf(u, statsByUser)).reversed()
            .thenComparing(User::getUsername));

        List<LeaderboardEntryDTO> entries = new ArrayList<>();
        int rank = 1;

        for (int i = 0; i < sorted.size(); i++) {
            User user = sorted.get(i);

            if (i > 0 && pointsOf(sorted.get(i - 1), statsByUser) > pointsOf(user, statsByUser)) {
                rank = i + 1;
            }

            SubmissionStats stats = statsByUser.get(user.getId());
            int points = pointsOf(user, statsByUser);
            long completed = stats != null ? stats.getCompleted() : 0L;
            double avgScore = stats != null && stats.getAvgScore() != null ? stats.getAvgScore() : 0.0;

            entries.add(LeaderboardEntryDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .points(points)
                .rank(rank)
                .previousRank(null)
                .challengesCompleted(completed)
                .averageScore(Math.round(avgScore * 10.0) / 10.0)
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

    private int pointsOf(User user, Map<Long, SubmissionStats> statsByUser) {
        SubmissionStats stats = statsByUser.get(user.getId());
        return stats != null && stats.getTotalScore() != null ? stats.getTotalScore().intValue() : 0;
    }
}
