package com.djenidi.ai_mentor.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeSubmissionRequest {
    @NotNull(message = "L'ID de la soumission est obligatoire")
    @Positive(message = "L'ID de la soumission doit être un nombre positif")
    private Long submissionId;
    private boolean forceReanalyze;
}
