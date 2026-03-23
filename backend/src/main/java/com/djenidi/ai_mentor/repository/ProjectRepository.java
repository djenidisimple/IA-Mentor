package com.djenidi.ai_mentor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    // ===== Méthodes de base =====
    
    /**
     * Trouve les projets par difficulté
     * Note: Correction du paramètre "difficilty" -> "difficulty"
     */
    List<Project> findByDifficulty(String difficulty);
    
    /**
     * Trouve les projets contenant une technologie spécifique
     */
    List<Project> findByTechStackContaining(String tech);
    
    // ===== Méthodes de recherche supplémentaires =====
    
    /**
     * Trouve un projet par son titre
     */
    Optional<Project> findByTitle(String title);
    
    /**
     * Trouve les projets par titre contenant un mot-clé
     */
    List<Project> findByTitleContaining(String keyword);
    
    /**
     * Trouve les projets par difficulté et technologie
     */
    List<Project> findByDifficultyAndTechStackContaining(String difficulty, String tech);
    
    // ===== Méthodes de tri =====
    
    /**
     * Trouve tous les projets triés par titre
     */
    List<Project> findAllByOrderByTitleAsc();
    
    /**
     * Trouve tous les projets triés par difficulté
     */
    List<Project> findAllByOrderByDifficultyAsc();
    
    /**
     * Trouve les projets par difficulté triés par titre
     */
    List<Project> findByDifficultyOrderByTitleAsc(String difficulty);
    
    // ===== Méthodes de comptage et vérification =====
    
    /**
     * Compte les projets par difficulté
     */
    long countByDifficulty(String difficulty);
    
    /**
     * Vérifie si un projet existe avec un titre donné
     */
    boolean existsByTitle(String title);
    
    /**
     * Vérifie si un projet existe avec une URL GitHub (si vous ajoutez ce champ)
     */
    boolean existsByGithubUrl(String githubUrl);
    
    // ===== Recherche avec critères multiples =====
    
    /**
     * Trouve les projets par difficulté et contenant une technologie
     */
    @Query("SELECT p FROM Project p WHERE p.difficulty = :difficulty AND p.techStack LIKE %:tech%")
    List<Project> findProjectsByDifficultyAndTech(@Param("difficulty") String difficulty, 
                                                   @Param("tech") String tech);
    
    /**
     * Trouve les projets par liste de difficultés
     */
    List<Project> findByDifficultyIn(List<String> difficulties);
    
    /**
     * Trouve les projets par liste de technologies
     */
    @Query("SELECT p FROM Project p WHERE p.techStack IN :techStacks")
    List<Project> findByTechStackIn(@Param("techStacks") List<String> techStacks);
    
    // ===== Recherche avec fetch join =====
    
    /**
     * Trouve un projet avec ses tâches (évite N+1 queries)
     */
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.id = :id")
    Optional<Project> findProjectWithTasksById(@Param("id") Long id);
    
    /**
     * Trouve un projet avec ses soumissions
     */
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.submissions WHERE p.id = :id")
    Optional<Project> findProjectWithSubmissionsById(@Param("id") Long id);
    
    /**
     * Trouve un projet avec ses tâches et soumissions
     */
    @Query("SELECT p FROM Project p " +
           "LEFT JOIN FETCH p.tasks " +
           "LEFT JOIN FETCH p.submissions " +
           "WHERE p.id = :id")
    Optional<Project> findProjectWithAllDetailsById(@Param("id") Long id);
    
    /**
     * Trouve tous les projets avec leurs tâches
     */
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.tasks")
    List<Project> findAllProjectsWithTasks();
    
    // ===== Recherche textuelle =====
    
    /**
     * Recherche dans le titre et la description courte
     */
    @Query("SELECT p FROM Project p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.detailedBrief) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Project> searchByKeyword(@Param("keyword") String keyword);
    
    /**
     * Recherche avancée avec critères multiples
     */
    @Query("SELECT p FROM Project p WHERE " +
           "(:difficulty IS NULL OR p.difficulty = :difficulty) AND " +
           "(:tech IS NULL OR p.techStack LIKE %:tech%) AND " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Project> advancedSearch(@Param("difficulty") String difficulty,
                                  @Param("tech") String tech,
                                  @Param("keyword") String keyword);
    
    // ===== Statistiques =====
    
    /**
     * Compte les projets par difficulté
     */
    @Query("SELECT p.difficulty, COUNT(p) FROM Project p GROUP BY p.difficulty")
    List<Object[]> countProjectsByDifficulty();
    
    /**
     * Trouve les projets les plus populaires (avec le plus de soumissions)
     */
    @Query("SELECT p FROM Project p " +
           "LEFT JOIN p.submissions s " +
           "GROUP BY p " +
           "ORDER BY COUNT(s) DESC")
    List<Project> findMostPopularProjects();
    
    /**
     * Limite le nombre de résultats pour les projets populaires
     */
    @Query("SELECT p FROM Project p " +
           "LEFT JOIN p.submissions s " +
           "GROUP BY p " +
           "ORDER BY COUNT(s) DESC")
    List<Project> findTopPopularProjects(org.springframework.data.domain.Pageable pageable);
    
    // ===== Méthodes de suppression en masse =====
    
    /**
     * Supprime tous les projets d'une difficulté donnée
     */
    @Modifying
    @Query("DELETE FROM Project p WHERE p.difficulty = :difficulty")
    void deleteByDifficulty(@Param("difficulty") String difficulty);
    
    /**
     * Supprime les projets sans tâches
     */
    @Modifying
    @Query("DELETE FROM Project p WHERE p.id NOT IN (SELECT DISTINCT t.project.id FROM Task t)")
    void deleteProjectsWithoutTasks();
    
    // ===== Méthodes de mise à jour =====
    
    /**
     * Met à jour la difficulté d'un projet
     */
    @Modifying
    @Query("UPDATE Project p SET p.difficulty = :difficulty WHERE p.id = :id")
    int updateDifficulty(@Param("id") Long id, @Param("difficulty") String difficulty);
    
    /**
     * Met à jour la technologie stack d'un projet
     */
    @Modifying
    @Query("UPDATE Project p SET p.techStack = :techStack WHERE p.id = :id")
    int updateTechStack(@Param("id") Long id, @Param("techStack") String techStack);
}