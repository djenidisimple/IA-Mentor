package com.djenidi.ai_mentor.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "projects")
public class Project {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    
    @Column(name = "short_description", columnDefinition = "TEXT")
    private String shortDescription;
    
    @Column(name = "detailed_brief", columnDefinition = "TEXT")
    private String detailedBrief; 
    
    @Column(nullable = false)
    private String difficulty;
    
    @Column(name = "tech_stack")
    private String techStack;
    
    // Relation OneToMany avec Task (un projet a plusieurs tâches)
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore 
    private List<Task> tasks = new ArrayList<>();
    
    // Relation OneToMany avec Submission (un projet peut avoir plusieurs soumissions)
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Submission> submissions = new ArrayList<>();
    
    // Constructeurs
    public Project() {}
    
    public Project(String title, String shortDescription, String detailedBrief, 
                   String difficulty, String techStack) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.detailedBrief = detailedBrief;
        this.difficulty = difficulty;
        this.techStack = techStack;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }
    
    public String getDetailedBrief() {
        return detailedBrief;
    }
    
    public void setDetailedBrief(String detailedBrief) {
        this.detailedBrief = detailedBrief;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }
    
    public List<Task> getTasks() {
        return tasks;
    }
    
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
    
    // Méthode utilitaire pour ajouter une tâche
    public void addTask(Task task) {
        tasks.add(task);
        task.setProject(this);
    }
    
    // Méthode utilitaire pour supprimer une tâche
    public void removeTask(Task task) {
        tasks.remove(task);
        task.setProject(null);
    }
    
    public List<Submission> getSubmissions() {
        return submissions;
    }
    
    public void setSubmissions(List<Submission> submissions) {
        this.submissions = submissions;
    }
}