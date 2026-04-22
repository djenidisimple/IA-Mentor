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
public class OllamaDiagnosticResponse {
    
    private boolean serviceAvailable;
    private boolean connectionSuccessful;
    private String apiUrl;
    private String model;
    private String testMessage;
    private String errorDetails;
    private long responseTimeMs;
    
    // Détails des tests
    private boolean modelAvailable;
    private String ollamaErrorCode;
    private String ollamaErrorMessage;
    private String gemmaVersion;
}
