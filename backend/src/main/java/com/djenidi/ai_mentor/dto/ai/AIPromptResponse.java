package com.djenidi.ai_mentor.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIPromptResponse {
    
    private String id;
    private String content;
    private String model;
    private String finishReason;
    
    private Integer promptTokens;
    private Integer completionTokens;
    private Integer totalTokens;
    
    private LocalDateTime createdAt;
    private long responseTimeMs;
    
    private List<TokenUsage> usage;
    private ErrorInfo error;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TokenUsage {
        private String type;
        private Integer count;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorInfo {
        private String code;
        private String message;
        private String details;
    }
}
