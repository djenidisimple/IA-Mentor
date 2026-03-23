package com.djenidi.ai_mentor.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.Analysis;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    Optional<Analysis> findBySubmissionId(Long subnissionId);
}
