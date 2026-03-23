package com.djenidi.ai_mentor.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tasks")
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore
    private Project project;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String criteria;
    
    // Constructeurs
    public Task() {}
    
    public Task(String description, String criteria, Project project) {
        this.description = description;
        this.criteria = criteria;
        this.project = project;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Project getProject() {
        return project;
    }
    
    // Cette méthode est essentielle !
    public void setProject(Project project) {
        this.project = project;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCriteria() {
        return criteria;
    }
    
    public void setCriteria(String criteria) {
        this.criteria = criteria;
    }
}