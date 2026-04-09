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
    private Boolean isPremium;
    private long challengesInProgress;
    private long challengesCompleted;
    private LocalDateTime createdAt;
    
    /**
     * Convertit une entité User en UserProfileResponse
     */
    public static UserProfileResponse fromEntity(User user) {
        if (user == null) return null;
        
        // Pour l'instant, on met 0 pour les challenges (à implémenter plus tard)
        long inProgress = 0L;
        long completed = 0L;
        
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .points(user.getPoints() != null ? user.getPoints() : 0)
                .isPremium(user.getIsPremium() != null ? user.getIsPremium() : false)
                .challengesInProgress(inProgress)
                .challengesCompleted(completed)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
