package com.djenidi.ai_mentor.dto.response;

import com.djenidi.ai_mentor.entity.SubmissionStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {

    private Long id;
    private Long userId;
    private String username;
    private Long challengeId;
    private String challengeTitle;
    private String challengeSlug;
    private String githubUrl;
    private SubmissionStatus status;
    private String aiFeedback;
    private Integer score;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
}
