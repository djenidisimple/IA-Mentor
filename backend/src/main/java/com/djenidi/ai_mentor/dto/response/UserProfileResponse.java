package com.djenidi.ai_mentor.dto.response;

import com.djenidi.ai_mentor.entity.User;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private Integer points;
    private Integer pointsEarned;
    private Boolean isPremium;
    private long challengesInProgress;
    private long challengesSubmitted;
    private long challengesCompleted;
    private long totalChallenges;
    private Double averageScore;
    private Double successRate;
    private long totalTimeMinutes;
    private long activeDays;
    private LocalDateTime createdAt;
}
