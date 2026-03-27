package com.djenidi.ai_mentor.dto.response;

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
    private Boolean isPremium;
    private long challengesInProgress;
    private long challengesCompleted;
    private LocalDateTime createdAt;
}
