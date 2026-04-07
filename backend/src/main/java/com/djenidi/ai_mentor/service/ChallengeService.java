package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.request.CreateChallengeRequest;
import com.djenidi.ai_mentor.dto.response.ChallengeResponse;
import com.djenidi.ai_mentor.entity.Category;
import com.djenidi.ai_mentor.entity.Challenge;
import com.djenidi.ai_mentor.entity.ChallengeLevel;
import com.djenidi.ai_mentor.entity.ChallengeType;
import com.djenidi.ai_mentor.exception.DuplicateResourceException;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.CategoryRepository;
import com.djenidi.ai_mentor.repository.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final CategoryRepository categoryRepository;

    public List<ChallengeResponse> getAllChallenges() {
        return challengeRepository.findAllWithDetails().stream()
                .map(this::toResponse)
                .toList();
    }

    public ChallengeResponse getChallengeBySlug(String slug) {
        Challenge challenge = challengeRepository.findBySlugWithDetails(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "slug", slug));
        return toResponse(challenge);
    }

    public List<ChallengeResponse> getChallengesByCategory(String categorySlug) {
        return challengeRepository.findByCategorySlugWithDetails(categorySlug).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ChallengeResponse> getChallengesByLevel(ChallengeLevel level) {
        return challengeRepository.findByLevelWithDetails(level).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ChallengeResponse> getChallengesByType(ChallengeType type) {
        return challengeRepository.findByTypeWithDetails(type).stream()
                .map(this::toResponse)
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
        return toResponse(saved);
    }

    @Transactional
    public void deleteChallenge(String slug) {
        Challenge challenge = challengeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge", "slug", slug));
        challengeRepository.delete(challenge);
    }

    // === HELPERS ===

    private ChallengeResponse toResponse(Challenge challenge) {
        return ChallengeResponse.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .slug(challenge.getSlug())
                .description(challenge.getDescription())
                .level(challenge.getLevel())
                .type(challenge.getType())
                .categoryName(challenge.getCategory().getName())
                .categorySlug(challenge.getCategory().getSlug())
                .technologies(challenge.getTechnologies())
                .criteresIA(challenge.getCriteresIA())
                .points(challenge.getPoints())
                .isPremium(challenge.getIsPremium())
                .createdAt(challenge.getCreatedAt())
                .build();
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
    }
}
