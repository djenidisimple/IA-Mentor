package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.RepositoryContentResponse;
import com.djenidi.ai_mentor.exception.GitHubApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitHubService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${github.api.token:}")
    private String githubToken;

    private static final String GITHUB_API_URL = "https://api.github.com";
    private static final int MAX_FILE_SIZE = 500 * 1024; // 500 KB
    private static final int MAX_DEPTH = 6; // ✅ FIX 2 : limite de profondeur de récursion

    // ✅ FIX 3 : constante statique, plus de List.of() recréé à chaque appel
    private static final Set<String> IGNORED_DIRECTORIES = Set.of(
        "node_modules", "target", "build", "dist", ".git",
        ".idea", ".vscode", "vendor", "__pycache__", ".next", "out"
    );

    private static final Set<String> SUPPORTED_EXTENSIONS = Set.of(
        ".java", ".kt", ".js", ".ts", ".jsx", ".tsx", ".py", ".go", ".rs",
        ".c", ".cpp", ".h", ".hpp", ".cs", ".rb", ".php", ".swift", ".sql"
    );

    public RepositoryContentResponse fetchRepositoryContent(String githubUrl) {
        try {
            String[] repoInfo = extractOwnerAndRepo(githubUrl);
            String owner = repoInfo[0];
            String repo = repoInfo[1];

            String defaultBranch = getDefaultBranch(owner, repo);
            List<RepositoryContentResponse.FileContent> files = fetchAllFiles(owner, repo, defaultBranch, "", 0);

            Set<String> directories = extractDirectories(files);
            RepositoryContentResponse.TreeNode root = buildFileTree(files);

            return RepositoryContentResponse.builder()
                    .owner(owner)
                    .repo(repo)
                    .defaultBranch(defaultBranch)
                    .files(files)
                    .directories(directories)
                    .root(root)
                    .totalFiles(files.size())
                    .totalSize(files.stream().mapToLong(RepositoryContentResponse.FileContent::getSize).sum())
                    .build();

        } catch (Exception e) {
            log.error("Failed to fetch repository content from {}", githubUrl, e);
            throw new GitHubApiException("Erreur lors de la récupération du repository: " + e.getMessage());
        }
    }

    private List<RepositoryContentResponse.FileContent> fetchAllFiles(
            String owner, String repo, String branch, String path, int depth) {

        // ✅ FIX 2 : stop si profondeur maximale atteinte
        if (depth > MAX_DEPTH) {
            log.warn("Profondeur maximale atteinte pour le path: {}", path);
            return Collections.emptyList();
        }

        List<RepositoryContentResponse.FileContent> files = new ArrayList<>();
        String url = GITHUB_API_URL + "/repos/" + owner + "/" + repo + "/contents/" + path + "?ref=" + branch;

        try {
            JsonNode items = makeGitHubRequest(url);

            if (!items.isArray()) return files;

            for (JsonNode item : items) {
                String type = item.path("type").asText();
                String name = item.path("name").asText();

                if ("file".equals(type)) {
                    // ✅ FIX 1 : filtre sur l'extension — uniquement les fichiers supportés
                    if (!isSupportedFile(name)) {
                        log.debug("Fichier ignoré (extension non supportée): {}", name);
                        continue;
                    }

                    long size = item.path("size").asLong();
                    if (size > MAX_FILE_SIZE) {
                        log.debug("Fichier ignoré (trop grand: {} KB): {}", size / 1024, name);
                        continue;
                    }

                    String filePath = item.path("path").asText();
                    String content = fetchFileContent(item.path("download_url").asText());

                    files.add(RepositoryContentResponse.FileContent.builder()
                            .path(filePath)
                            .name(name)
                            .content(content)
                            .extension(getFileExtension(name))
                            .size(size)
                            .sha(item.path("sha").asText())
                            .build());

                } else if ("dir".equals(type) && !IGNORED_DIRECTORIES.contains(name.toLowerCase())) {
                    // ✅ FIX 2 : depth + 1 à chaque niveau
                    files.addAll(fetchAllFiles(owner, repo, branch, item.path("path").asText(), depth + 1));
                }
            }
        } catch (Exception e) {
            log.warn("Could not fetch directory '{}': {}", path, e.getMessage());
        }

        return files;
    }

    private Set<String> extractDirectories(List<RepositoryContentResponse.FileContent> files) {
        Set<String> directories = new HashSet<>();
        for (RepositoryContentResponse.FileContent file : files) {
            String path = file.getPath();
            int lastSlash = path.lastIndexOf('/');
            if (lastSlash > 0) {
                directories.add(path.substring(0, lastSlash));
            }
        }
        return directories;
    }

    private RepositoryContentResponse.TreeNode buildFileTree(List<RepositoryContentResponse.FileContent> files) {
        Map<String, RepositoryContentResponse.TreeNode> nodeMap = new HashMap<>();
        RepositoryContentResponse.TreeNode root = RepositoryContentResponse.TreeNode.builder()
                .name("root")
                .path("")
                .type("directory")
                .children(new ArrayList<>())
                .build();
        nodeMap.put("", root);

        List<RepositoryContentResponse.FileContent> sortedFiles = new ArrayList<>(files);
        sortedFiles.sort(Comparator.comparing(RepositoryContentResponse.FileContent::getPath));

        for (RepositoryContentResponse.FileContent file : sortedFiles) {
            String[] parts = file.getPath().split("/");
            String currentPath = "";
            RepositoryContentResponse.TreeNode parent = root;

            for (int i = 0; i < parts.length; i++) {
                String part = parts[i];
                String newPath = currentPath.isEmpty() ? part : currentPath + "/" + part;
                boolean isFile = (i == parts.length - 1);

                if (!nodeMap.containsKey(newPath)) {
                    RepositoryContentResponse.TreeNode node = RepositoryContentResponse.TreeNode.builder()
                            .name(part)
                            .path(newPath)
                            .type(isFile ? "file" : "directory")
                            .size(isFile ? file.getSize() : null)
                            .children(isFile ? null : new ArrayList<>())
                            .build();

                    nodeMap.put(newPath, node);

                    if (parent.getChildren() != null) {
                        parent.getChildren().add(node);
                    }
                }

                parent = nodeMap.get(newPath);
                currentPath = newPath;
            }
        }

        return root;
    }

    private String[] extractOwnerAndRepo(String githubUrl) {
        Pattern pattern = Pattern.compile("github\\.com/([^/]+)/([^/]+)");
        Matcher matcher = pattern.matcher(githubUrl);
        if (!matcher.find()) {
            throw new GitHubApiException("URL GitHub invalide: " + githubUrl);
        }
        return new String[]{matcher.group(1), matcher.group(2).replace(".git", "")};
    }

    private String getDefaultBranch(String owner, String repo) {
        JsonNode response = makeGitHubRequest(GITHUB_API_URL + "/repos/" + owner + "/" + repo);
        return response.path("default_branch").asText("main");
    }

    private String fetchFileContent(String downloadUrl) {
        try {
            HttpEntity<String> entity = new HttpEntity<>(buildHeaders());
            ResponseEntity<String> response = restTemplate.exchange(
                    downloadUrl, HttpMethod.GET, entity, String.class);
            return response.getBody() != null ? response.getBody() : "";
        } catch (Exception e) {
            log.error("Failed to fetch file content from {}: {}", downloadUrl, e.getMessage());
            return "";
        }
    }

    private JsonNode makeGitHubRequest(String url) {
        try {
            HttpEntity<String> entity = new HttpEntity<>(buildHeaders());
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class);
            return objectMapper.readTree(response.getBody());
        } catch (Exception e) {
            throw new GitHubApiException("GitHub API error: " + e.getMessage());
        }
    }

    // ✅ Extraction des headers communs pour éviter la duplication
    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        if (githubToken != null && !githubToken.isEmpty()) {
            headers.set("Authorization", "Bearer " + githubToken);
        }
        headers.set("Accept", "application/vnd.github.v3+json");
        return headers;
    }

    // ✅ FIX 1 : méthode maintenant utilisée
    private boolean isSupportedFile(String fileName) {
        return SUPPORTED_EXTENSIONS.stream().anyMatch(fileName::endsWith);
    }

    private String getFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        return lastDot > 0 ? fileName.substring(lastDot) : "";
    }
}
