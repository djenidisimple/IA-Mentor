package com.djenidi.ai_mentor.repository;

import com.djenidi.ai_mentor.entity.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    
    Optional<Analysis> findBySubmissionId(Long submissionId);
    
    boolean existsBySubmissionId(Long submissionId);
}
