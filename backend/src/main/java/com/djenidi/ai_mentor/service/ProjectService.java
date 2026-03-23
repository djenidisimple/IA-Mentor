package com.djenidi.ai_mentor.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.djenidi.ai_mentor.models.Project;
import com.djenidi.ai_mentor.models.Task;
import com.djenidi.ai_mentor.repository.ProjectRepository;
import com.djenidi.ai_mentor.repository.TaskRepository;

@Service
@Transactional
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    
    public ProjectService(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }
    
    /**
     * Crée un nouveau projet
     */
    public Project createProject(Project project) {
        // Validation des données
        if (project.getTitle() == null || project.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Project title cannot be empty");
        }
        
        return projectRepository.save(project);
    }
    
    /**
     * Récupère tous les projets
     */
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    /**
     * Récupère un projet par son ID
     */
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }
    
    /**
     * Récupère un projet avec toutes ses tâches
     */
    public Project getProjectWithTasks(Long id) {
        Project project = getProjectById(id);
        // Force le chargement des tâches si nécessaire
        if (project.getTasks() != null) {
            project.getTasks().size();
        }
        return project;
    }
    
    /**
     * Met à jour un projet existant
     */
    public Project updateProject(Long id, Project projectDetails) {
        Project project = getProjectById(id);
        
        // Mise à jour des champs (seulement si les nouvelles valeurs ne sont pas null)
        if (projectDetails.getTitle() != null) {
            project.setTitle(projectDetails.getTitle());
        }
        
        if (projectDetails.getShortDescription() != null) {
            project.setShortDescription(projectDetails.getShortDescription());
        }
        
        if (projectDetails.getDetailedBrief() != null) {
            project.setDetailedBrief(projectDetails.getDetailedBrief());
        }
        
        if (projectDetails.getDifficulty() != null) {
            project.setDifficulty(projectDetails.getDifficulty());
        }
        
        if (projectDetails.getTechStack() != null) {
            project.setTechStack(projectDetails.getTechStack());
        }
        
        return projectRepository.save(project);
    }
    
    /**
     * Supprime un projet
     */
    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        
        // Vérifier si le projet a des soumissions
        if (project.getSubmissions() != null && !project.getSubmissions().isEmpty()) {
            throw new RuntimeException("Cannot delete project with existing submissions");
        }
        
        // Supprimer d'abord les tâches associées (si cascade n'est pas configurée)
        if (project.getTasks() != null && !project.getTasks().isEmpty()) {
            taskRepository.deleteAll(project.getTasks());
        }
        
        projectRepository.deleteById(id);
    }
    
    /**
     * Récupère les projets par difficulté
     */
    public List<Project> getProjectsByDifficulty(String difficulty) {
        return projectRepository.findByDifficulty(difficulty);
    }
    
    /**
     * Récupère les projets par technologie
     */
    public List<Project> getProjectsByTechStack(String tech) {
        return projectRepository.findByTechStackContaining(tech);
    }
    
    /**
     * Ajoute une tâche à un projet
     */
    public Project addTaskToProject(Long projectId, Task task) {
        Project project = getProjectById(projectId);
        project.addTask(task);
        task.setProject(project);
        taskRepository.save(task);
        return projectRepository.save(project);
    }
    
    /**
     * Vérifie si un projet existe
     */
    public boolean existsById(Long id) {
        return projectRepository.existsById(id);
    }
    
    /**
     * Compte le nombre de projets
     */
    public long countProjects() {
        return projectRepository.count();
    }
    
    /**
     * Récupère les projets les plus populaires (avec le plus de soumissions)
     * Cette méthode doit être implémentée dans ProjectRepository
     */
    public List<Project> getMostPopularProjects() {
        // Utiliser une requête JPQL personnalisée
        return projectRepository.findMostPopularProjects();
    }
    
    /**
     * Recherche avancée de projets
     */
    public List<Project> advancedSearch(String difficulty, String tech, String keyword) {
        return projectRepository.advancedSearch(difficulty, tech, keyword);
    }
}