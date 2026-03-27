package com.djenidi.ai_mentor.dto.response;

import com.djenidi.ai_mentor.entity.ChallengeLevel;
import com.djenidi.ai_mentor.entity.ChallengeType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeResponse {

    private Long id;
    private String title;
    private String slug;
    private String description;
    private ChallengeLevel level;
    private ChallengeType type;
    private String categoryName;
    private String categorySlug;
    private List<String> technologies;
    private List<String> criteresIA;
    private Integer points;
    private Boolean isPremium;
    private LocalDateTime createdAt;
}
