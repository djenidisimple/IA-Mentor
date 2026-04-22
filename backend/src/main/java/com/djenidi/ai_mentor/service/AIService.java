package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.entity.Challenge;

public interface AIService {
    
    AIAnalysisResult analyzeRepository(RepositoryContentResponse repository, Challenge challenge);
    
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
