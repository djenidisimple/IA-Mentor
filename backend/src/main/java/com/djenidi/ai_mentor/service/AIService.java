package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;

public interface AIService {
    
    AIAnalysisResult analyzeRepository(RepositoryContentResponse repository, String challengeContext);
    
    record AIAnalysisResult(
        String summary,
        String detailedFeedback,
        int score,
        String strengths,
        String weaknesses,
        String suggestions,
        String codeQualityMetrics
    ) {}
}
