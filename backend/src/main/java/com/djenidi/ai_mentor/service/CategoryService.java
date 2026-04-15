package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.request.CreateCategoryRequest;
import com.djenidi.ai_mentor.dto.response.CategoryResponse;
import com.djenidi.ai_mentor.entity.Category;
import com.djenidi.ai_mentor.exception.DuplicateResourceException;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "slug", slug));
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Catégorie", "nom", request.getName());
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(generateSlug(request.getName()))
                .description(request.getDescription())
                .build();

        Category saved = categoryRepository.save(category);
        return toResponse(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(String slug, CreateCategoryRequest request) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "slug", slug));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        // On ne change pas le slug à l'update pour éviter les liens cassés

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Catégorie", "slug", slug));
        categoryRepository.delete(category);
    }

    // === HELPERS ===

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .challengeCount(category.getChallenges() != null ? category.getChallenges().size() : 0)
                .createdAt(category.getCreatedAt())
                .build();
    }

    private String generateSlug(String name) {
        if (name == null || name.isBlank()) {
            return "untitled-" + System.currentTimeMillis();
        }

        String slug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();

        slug = slug.replaceAll("(^-+|-+$)", "");

        if (slug.isEmpty()) {
            return "untitled-" + System.currentTimeMillis();
        }

        return slug;
    }
}
