package com.djenidi.ai_mentor.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.djenidi.ai_mentor.models.Project;
import com.djenidi.ai_mentor.models.Task;
import com.djenidi.ai_mentor.repository.ProjectRepository;
import com.djenidi.ai_mentor.repository.TaskRepository;
import com.djenidi.ai_mentor.repository.TaskResultRepository;

@Service
@Transactional
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskResultRepository taskResultRepository;
    
    public TaskService(TaskRepository taskRepository, 
                       ProjectRepository projectRepository,
                       TaskResultRepository taskResultRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.taskResultRepository = taskResultRepository;
    }
    
    /**
     * Crée une nouvelle tâche pour un projet
     */
    public Task createTask(Long projectId, Task task) {
        // Vérifier que le projet existe
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        // Valider les données
        if (task.getDescription() == null || task.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Task description cannot be empty");
        }
        
        // Associer la tâche au projet
        task.setProject(project);
        
        return taskRepository.save(task);
    }
    
    /**
     * Récupère toutes les tâches d'un projet
     */
    public List<Task> getTasksByProject(Long projectId) {
        // Vérifier que le projet existe
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
        
        return taskRepository.findByProjectId(projectId);
    }
    
    /**
     * Récupère une tâche par son ID
     */
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }
    
    /**
     * Récupère une tâche avec son projet
     */
    public Task getTaskWithProject(Long id) {
        Task task = getTaskById(id);
        // Force le chargement du projet si nécessaire
        task.getProject().getId();
        return task;
    }
    
    /**
     * Met à jour une tâche existante
     */
    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        
        // Vérifier si la tâche a déjà des résultats d'analyse
        boolean hasTaskResults = taskResultRepository.existsByTaskId(id);
        if (hasTaskResults) {
            throw new RuntimeException("Cannot update task that has already been analyzed");
        }
        
        // Mise à jour conditionnelle
        if (taskDetails.getDescription() != null && !taskDetails.getDescription().trim().isEmpty()) {
            task.setDescription(taskDetails.getDescription());
        }
        
        if (taskDetails.getCriteria() != null) {
            task.setCriteria(taskDetails.getCriteria());
        }
        
        return taskRepository.save(task);
    }
    
    /**
     * Supprime une tâche
     */
    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        
        // Vérifier si la tâche a déjà des résultats d'analyse
        boolean hasTaskResults = taskResultRepository.existsByTaskId(id);
        if (hasTaskResults) {
            throw new RuntimeException("Cannot delete task that has already been analyzed");
        }
        
        taskRepository.deleteById(id);
    }
    
    /**
     * Supprime toutes les tâches d'un projet
     */
    public void deleteTasksByProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        
        // Vérifier si des tâches ont déjà des résultats d'analyse
        for (Task task : tasks) {
            boolean hasTaskResults = taskResultRepository.existsByTaskId(task.getId());
            if (hasTaskResults) {
                throw new RuntimeException("Cannot delete tasks that have already been analyzed");
            }
        }
        
        taskRepository.deleteAll(tasks);
    }
    
    /**
     * Compte les tâches d'un projet
     */
    public long countTasksByProject(Long projectId) {
        return taskRepository.countByProjectId(projectId);
    }
    
    /**
     * Vérifie si une tâche existe
     */
    public boolean existsById(Long id) {
        return taskRepository.existsById(id);
    }
    
    /**
     * Met à jour partiellement une tâche
     */
    public Task patchTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        
        if (taskDetails.getDescription() != null) {
            task.setDescription(taskDetails.getDescription());
        }
        
        if (taskDetails.getCriteria() != null) {
            task.setCriteria(taskDetails.getCriteria());
        }
        
        return taskRepository.save(task);
    }
    
    /**
     * Récupère les tâches par critère
     */
    public List<Task> getTasksByCriteria(String criteria) {
        return taskRepository.findByCriteriaContaining(criteria);
    }
    
    /**
     * Récupère toutes les tâches
     */
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }
}