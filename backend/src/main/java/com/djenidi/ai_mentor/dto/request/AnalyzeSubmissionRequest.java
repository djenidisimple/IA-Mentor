package com.djenidi.ai_mentor.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyzeSubmissionRequest {
    private Long submissionId;
    private boolean forceReanalyze;
}
