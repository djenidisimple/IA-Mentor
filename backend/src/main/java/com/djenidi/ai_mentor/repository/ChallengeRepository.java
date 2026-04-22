package com.djenidi.ai_mentor.repository;

import com.djenidi.ai_mentor.entity.Challenge;
import com.djenidi.ai_mentor.entity.ChallengeLevel;
import com.djenidi.ai_mentor.entity.ChallengeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    // ========== MÉTHODES SIMPLES (sans chargement des collections) ==========
    
    Optional<Challenge> findBySlug(String slug);
    
    List<Challenge> findByCategoryId(Long categoryId);
    
    List<Challenge> findByLevel(ChallengeLevel level);
    
    List<Challenge> findByType(ChallengeType type);
    
    List<Challenge> findByLevelAndType(ChallengeLevel level, ChallengeType type);
    
    List<Challenge> findByCategorySlug(String categorySlug);
    
    boolean existsBySlug(String slug);

    @Query("SELECT DISTINCT c FROM Challenge c " +
       "LEFT JOIN FETCH c.technologies " +
       "LEFT JOIN FETCH c.criteresIA " +
       "LEFT JOIN FETCH c.category " +
       "LEFT JOIN FETCH c.comments com " + // Charge les commentaires
       "LEFT JOIN FETCH com.user " +        // Charge l'auteur du commentaire pour éviter le N+1
       "WHERE c.slug = :slug")
    Optional<Challenge> findBySlugWithComments(@Param("slug") String slug);
    
    // ========== MÉTHODES AVEC CHARGEMENT DES COLLECTIONS ==========
    
    @Query("SELECT DISTINCT c FROM Challenge c " +
           "LEFT JOIN FETCH c.technologies " +
           "LEFT JOIN FETCH c.criteresIA " +
           "LEFT JOIN FETCH c.category")
    List<Challenge> findAllWithDetails();
    
    @Query("SELECT DISTINCT c FROM Challenge c " +
           "LEFT JOIN FETCH c.technologies " +
           "LEFT JOIN FETCH c.criteresIA " +
           "LEFT JOIN FETCH c.category " +
           "WHERE c.slug = :slug")
    Optional<Challenge> findBySlugWithDetails(@Param("slug") String slug);
    
    @Query("SELECT DISTINCT c FROM Challenge c " +
           "LEFT JOIN FETCH c.technologies " +
           "LEFT JOIN FETCH c.criteresIA " +
           "LEFT JOIN FETCH c.category " +
           "WHERE c.category.slug = :categorySlug")
    List<Challenge> findByCategorySlugWithDetails(@Param("categorySlug") String categorySlug);
    
    @Query("SELECT DISTINCT c FROM Challenge c " +
           "LEFT JOIN FETCH c.technologies " +
           "LEFT JOIN FETCH c.criteresIA " +
           "LEFT JOIN FETCH c.category " +
           "WHERE c.level = :level")
    List<Challenge> findByLevelWithDetails(@Param("level") ChallengeLevel level);
    
    @Query("SELECT DISTINCT c FROM Challenge c " +
           "LEFT JOIN FETCH c.technologies " +
           "LEFT JOIN FETCH c.criteresIA " +
           "LEFT JOIN FETCH c.category " +
           "WHERE c.type = :type")
    List<Challenge> findByTypeWithDetails(@Param("type") ChallengeType type);
}
