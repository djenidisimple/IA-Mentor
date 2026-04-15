package com.djenidi.ai_mentor.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIConfiguration {
    
    private String provider; // "openai", "gemini", "claude", "ollama"
    private String apiKey;
    private String apiUrl;
    private String model;
    
    private Double temperature;
    private Integer maxTokens;
    private Integer timeoutSeconds;
    
    private Boolean enabled;
    private Boolean fallbackEnabled;
    private String fallbackProvider;
}
