package com.djenidi.ai_mentor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepositoryContentResponse {
    private String owner;
    private String repo;
    private String defaultBranch;
    private List<FileContent> files;
    private Set<String> directories;
    private TreeNode root;            
    private int totalFiles;
    private long totalSize;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileContent {
        private String path;
        private String name;
        private String content;
        private String extension;
        private long size;
        private String sha;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TreeNode {
        private String name;
        private String path;
        private String type;
        private Long size;
        private List<TreeNode> children;
    }
}
