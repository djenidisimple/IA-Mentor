package com.djenidi.ai_mentor.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GeminiDiagnosticResponse {
    
    private boolean apiKeyConfigured;
    private boolean connectionSuccessful;
    private String apiUrl;
    private String model;
    private String testMessage;
    private String errorDetails;
    private long responseTimeMs;
    
    // Détails des tests
    private boolean quotaAvailable;
    private String geminiErrorCode;
    private String geminiErrorMessage;
}
