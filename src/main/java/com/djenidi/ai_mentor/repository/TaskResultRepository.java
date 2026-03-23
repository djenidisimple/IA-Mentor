package com.djenidi.ai_mentor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.TaskResult;

@Repository
public interface TaskResultRepository extends JpaRepository<TaskResult, Long> {
    List<TaskResult> findByAnalysisId(Long analysis);
}
