package com.djenidi.ai_mentor.dto;

public record UserSummaryDTO(
    Long id,
    String username,
    String avatar,
    boolean isPremium,
    String role,
    String reason
) {
    public UserSummaryDTO(Long id, String username, String avatar) {
        this(id, username, avatar, false, "USER", null);
    }
}
