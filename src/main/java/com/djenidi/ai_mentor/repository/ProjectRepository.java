package com.djenidi.ai_mentor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.djenidi.ai_mentor.models.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByDifficulty(String difficilty);
    List<Project> findByTechStackContaining(String tech);
}
