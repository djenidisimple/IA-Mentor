package com.djenidi.ai_mentor.dto;

import java.time.LocalDateTime;

public record CommentDTO(
    Long id,
    String content,
    UserSummaryDTO user,
    Long likesCount,
    LocalDateTime createdAt
) {}