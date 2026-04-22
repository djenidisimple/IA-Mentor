package com.djenidi.ai_mentor.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PostDTO(
    Long id,
    UserSummaryDTO author,
    String content,
    CodeSnippetDTO code,
    List<String> tags,
    long likes,
    long comments,
    long shares,
    LocalDateTime createdAt,
    boolean isLiked
) {}