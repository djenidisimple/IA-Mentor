package com.djenidi.ai_mentor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserId(Long userId);
    List<Submission> findByProjectId(Long projectId);
    Optional<Submission> findByUserIdAndProjectId(Long userId, Long projectId);
}
