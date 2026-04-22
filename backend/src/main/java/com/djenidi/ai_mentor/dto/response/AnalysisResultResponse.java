package com.djenidi.ai_mentor.dto.response;

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
public class AnalysisResultResponse {
    private Long id;
    private Long submissionId;
    private String summary;
    private String detailedFeedback;
    private Integer score;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
    private CodeQualityMetrics metrics;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeQualityMetrics {
        private int filesAnalyzed;
        private int totalLines;
        private int commentLines;
        private double commentRatio;
        private List<String> detectedLanguages;
        private boolean hasReadme;
        private boolean hasTests;
        private double complexityScore;
        private int maintainabilityIndex;
    }
}
