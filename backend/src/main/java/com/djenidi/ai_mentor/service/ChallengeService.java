package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.request.CreateChallengeRequest;
import com.djenidi.ai_mentor.dto.response.ChallengeResponse;
import com.djenidi.ai_mentor.entity.Category;
import com.djenidi.ai_mentor.entity.Challenge;
import com.djenidi.ai_mentor.entity.ChallengeLevel;
import com.djenidi.ai_mentor.entity.ChallengeType;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import com.djenidi.ai_mentor.exception.DuplicateResourceException;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.CategoryRepository;
import com.djenidi.ai_mentor.repository.ChallengeRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final CategoryRepository categoryRepository;
    private final SubmissionRepository submissionRepository;

    public List<ChallengeResponse> getAllChallenges() {
        Map<Long, Double> averageScores = getAverageScoresByChallenge();
        return challengeRepository.findAllWithDetails().stream()
                .map(challenge -> toResponse(challenge, averageScores))
                .toList();
    }

    public ChallengeResponse getChallengeBySlug(String slug) {
        Challenge challenge = challengeRepository.findBySlugWithDetails(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "slug", slug));
        return toResponse(challenge, getAverageScoresByChallenge());
    }

    public List<ChallengeResponse> getChallengesByCategory(String categorySlug) {
        Map<Long, Double> averageScores = getAverageScoresByChallenge();
        return challengeRepository.findByCategorySlugWithDetails(categorySlug).stream()
                .map(challenge -> toResponse(challenge, averageScores))
                .toList();
    }

    public List<ChallengeResponse> getChallengesByLevel(ChallengeLevel level) {
        Map<Long, Double> averageScores = getAverageScoresByChallenge();
        return challengeRepository.findByLevelWithDetails(level).stream()
                .map(challenge -> toResponse(challenge, averageScores))
                .toList();
    }

    public List<ChallengeResponse> getChallengesByType(ChallengeType type) {
        Map<Long, Double> averageScores = getAverageScoresByChallenge();
        return challengeRepository.findByTypeWithDetails(type).stream()
                .map(challenge -> toResponse(challenge, averageScores))
                .toList();
    }

    @Transactional
    public ChallengeResponse createChallenge(CreateChallengeRequest request) {
        // Vérifier que la catégorie existe
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "id", request.getCategoryId()));

        String slug = generateSlug(request.getTitle());
        if (challengeRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("Challenge", "slug", slug);
        }

        Challenge challenge = Challenge.builder()
                .title(request.getTitle())
                .slug(slug)
                .description(request.getDescription())
                .level(request.getLevel())
                .type(request.getType())
                .category(category)
                .technologies(request.getTechnologies() != null ? request.getTechnologies() : Set.of())
                .criteresIA(request.getCriteresIA() != null ? request.getCriteresIA() : Set.of())
                .points(request.getPoints())
                .isPremium(request.getIsPremium() != null ? request.getIsPremium() : false)
                .build();

        Challenge saved = challengeRepository.save(challenge);
        return toResponse(saved, getAverageScoresByChallenge());
    }

    @Transactional
    public void deleteChallenge(String slug) {
        Challenge challenge = challengeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "slug", slug));
        challengeRepository.delete(challenge);
    }

    @Transactional
    public ChallengeResponse reviewChallenge(String slug) {
        Challenge challenge = challengeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "slug", slug));
        challenge.setReviewed(true);
        return toResponse(challengeRepository.save(challenge), getAverageScoresByChallenge());
    }

    // === HELPERS ===

    private Map<Long, Double> getAverageScoresByChallenge() {
        return submissionRepository.findAverageScoreByStatus(SubmissionStatus.REVIEWED).stream()
                .collect(Collectors.toMap(
                        SubmissionRepository.ChallengeAverageScore::getChallengeId,
                        SubmissionRepository.ChallengeAverageScore::getAvgScore
                ));
    }

    private ChallengeResponse toResponse(Challenge challenge, Map<Long, Double> averageScores) {
        return ChallengeResponse.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .slug(challenge.getSlug())
                .description(challenge.getDescription())
                .level(challenge.getLevel())
                .type(challenge.getType())
                .categoryName(challenge.getCategory() != null ? challenge.getCategory().getName() : null)
                .categorySlug(challenge.getCategory() != null ? challenge.getCategory().getSlug() : null)
                .technologies(challenge.getTechnologies() != null ? challenge.getTechnologies() : Set.of())
                .criteresIA(challenge.getCriteresIA() != null ? challenge.getCriteresIA() : Set.of())
                .points(challenge.getPoints())
                .isPremium(challenge.getIsPremium())
                .reviewed(challenge.getReviewed())
                .averageScore(averageScores.get(challenge.getId()))
                .createdAt(challenge.getCreatedAt())
                .build();
    }

    private String generateSlug(String title) {
        if (title == null || title.isBlank()) {
            return "untitled-" + System.currentTimeMillis();
        }

        String slug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();

        // remove leading/trailing hyphens
        slug = slug.replaceAll("(^-+|-+$)", "");

        if (slug.isEmpty()) {
            return "untitled-" + System.currentTimeMillis();
        }

        return slug;
    }
}
