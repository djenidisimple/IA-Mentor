package com.djenidi.ai_mentor.dto.response;

import lombok.Builder;

@Builder
public record LeaderboardEntryDTO(
    Long id,
    String username,
    String avatarUrl,
    int points,
    int rank,
    Integer previousRank,
    long challengesCompleted,
    double averageScore,
    boolean isPremium
) {}
