package com.djenidi.ai_mentor.repository;

import com.djenidi.ai_mentor.entity.Challenge;
import com.djenidi.ai_mentor.entity.ChallengeLevel;
import com.djenidi.ai_mentor.entity.ChallengeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    Optional<Challenge> findBySlug(String slug);

    List<Challenge> findByCategoryId(Long categoryId);

    List<Challenge> findByLevel(ChallengeLevel level);

    List<Challenge> findByType(ChallengeType type);

    List<Challenge> findByLevelAndType(ChallengeLevel level, ChallengeType type);

    List<Challenge> findByCategorySlug(String categorySlug);

    boolean existsBySlug(String slug);
}
