package com.djenidi.ai_mentor.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisRequest {
    
    private String challengeId;
    private String challengeTitle;
    private String challengeDescription;
    private String challengeDifficulty;
    private List<String> expectedTechnologies;
    
    private String repositoryUrl;
    private String repositoryOwner;
    private String repositoryName;
    private String defaultBranch;
    
    private List<FileInfo> files;
    private int totalFiles;
    private long totalSizeBytes;
    
    private String submissionId;
    private String userId;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileInfo {
        private String path;
        private String name;
        private String content;
        private String extension;
        private long size;
        private String language;
    }
}
