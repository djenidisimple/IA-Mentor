package com.djenidi.ai_mentor.dto;

public record TrendingTopicDTO(
    Long id,
    String tag,
    long posts,
    String category
) {}