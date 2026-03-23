package com.djenidi.ai_mentor.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.djenidi.ai_mentor.models.Project;
import com.djenidi.ai_mentor.models.Task;
import com.djenidi.ai_mentor.service.ProjectService;
import com.djenidi.ai_mentor.service.TaskService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {
    
    private final ProjectService projectService;
    private final TaskService taskService;
    
    public ProjectController(ProjectService projectService, TaskService taskService) {
        this.projectService = projectService;
        this.taskService = taskService;
    }
    
    /**
     * Crée un nouveau projet
     */
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }
    
    /**
     * Récupère tous les projets
     */
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Récupère un projet par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }
    
    /**
     * Récupère un projet avec ses tâches
     */
    @GetMapping("/{id}/with-tasks")
    public ResponseEntity<Project> getProjectWithTasks(@PathVariable Long id) {
        Project project = projectService.getProjectWithTasks(id);
        return ResponseEntity.ok(project);
    }
    
    /**
     * Met à jour un projet
     */
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project project) {
        Project updatedProject = projectService.updateProject(id, project);
        return ResponseEntity.ok(updatedProject);
    }
    
    /**
     * Supprime un projet
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Récupère les projets par difficulté
     */
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<Project>> getProjectsByDifficulty(@PathVariable String difficulty) {
        List<Project> projects = projectService.getProjectsByDifficulty(difficulty);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Récupère les projets par technologie
     */
    @GetMapping("/tech/{tech}")
    public ResponseEntity<List<Project>> getProjectsByTechStack(@PathVariable String tech) {
        List<Project> projects = projectService.getProjectsByTechStack(tech);
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Ajoute une tâche à un projet
     */
    @PostMapping("/{projectId}/tasks")
    public ResponseEntity<Task> addTaskToProject(@PathVariable Long projectId, @RequestBody Task task) {
        Task createdTask = taskService.createTask(projectId, task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }
    
    /**
     * Récupère toutes les tâches d'un projet
     */
    @GetMapping("/{projectId}/tasks")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Vérifie si un projet existe
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Long id) {
        boolean exists = projectService.existsById(id);
        return ResponseEntity.ok(exists);
    }
    
    /**
     * Compte le nombre de projets
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countProjects() {
        long count = projectService.countProjects();
        return ResponseEntity.ok(count);
    }
    
    /**
     * Récupère les projets les plus populaires
     */
    @GetMapping("/popular")
    public ResponseEntity<List<Project>> getMostPopularProjects() {
        List<Project> projects = projectService.getMostPopularProjects();
        return ResponseEntity.ok(projects);
    }
    
    /**
     * Recherche avancée de projets
     */
    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects(@RequestParam(required = false) String keyword,
                                                        @RequestParam(required = false) String difficulty,
                                                        @RequestParam(required = false) String tech) {
        List<Project> projects = projectService.advancedSearch(difficulty, tech, keyword);
        return ResponseEntity.ok(projects);
    }
}