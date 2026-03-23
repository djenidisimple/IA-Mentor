package com.djenidi.ai_mentor.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.djenidi.ai_mentor.models.Task;
import com.djenidi.ai_mentor.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    
    private final TaskService taskService;
    
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    
    /**
     * Crée une nouvelle tâche
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestParam Long projectId, @RequestBody Task task) {
        Task createdTask = taskService.createTask(projectId, task);
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }
    
    /**
     * Récupère toutes les tâches d'un projet
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Récupère une tâche par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }
    
    /**
     * Récupère une tâche avec son projet
     */
    @GetMapping("/{id}/with-project")
    public ResponseEntity<Task> getTaskWithProject(@PathVariable Long id) {
        Task task = taskService.getTaskWithProject(id);
        return ResponseEntity.ok(task);
    }
    
    /**
     * Met à jour une tâche
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        Task updatedTask = taskService.updateTask(id, task);
        return ResponseEntity.ok(updatedTask);
    }
    
    /**
     * Met à jour partiellement une tâche
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Task> patchTask(@PathVariable Long id, @RequestBody Task task) {
        Task patchedTask = taskService.patchTask(id, task);
        return ResponseEntity.ok(patchedTask);
    }
    
    /**
     * Supprime une tâche
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Supprime toutes les tâches d'un projet
     */
    @DeleteMapping("/project/{projectId}")
    public ResponseEntity<Void> deleteTasksByProject(@PathVariable Long projectId) {
        taskService.deleteTasksByProject(projectId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Compte les tâches d'un projet
     */
    @GetMapping("/project/{projectId}/count")
    public ResponseEntity<Long> countTasksByProject(@PathVariable Long projectId) {
        long count = taskService.countTasksByProject(projectId);
        return ResponseEntity.ok(count);
    }
    
    /**
     * Vérifie si une tâche existe
     */
    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> existsById(@PathVariable Long id) {
        boolean exists = taskService.existsById(id);
        return ResponseEntity.ok(exists);
    }
    
    /**
     * Récupère toutes les tâches
     */
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    
    /**
     * Recherche des tâches par critère
     */
    @GetMapping("/search")
    public ResponseEntity<List<Task>> searchTasksByCriteria(@RequestParam String criteria) {
        List<Task> tasks = taskService.getTasksByCriteria(criteria);
        return ResponseEntity.ok(tasks);
    }
}