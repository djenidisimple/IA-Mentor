package com.djenidi.ai_mentor.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.djenidi.ai_mentor.models.Project;
import com.djenidi.ai_mentor.repository.ProjectRepository;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        project.setTitle(projectDetails.getTitle());
        project.setShortDescription(projectDetails.getShortDescription());
        project.setDifficulty(projectDetails.getDifficulty());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
