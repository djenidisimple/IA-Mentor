package com.djenidi.ai_mentor.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "task_results")
public class TaskResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "analysis_id", nullable = false)
    @JsonBackReference
    private Analysis analysis;
    
    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
    
    private Boolean checked;
    
    @Column(name = "ai_comment", columnDefinition = "TEXT")
    private String aiComment;
    
    // Constructeurs
    public TaskResult() {}
    
    public TaskResult(Analysis analysis, Task task, Boolean checked, String aiComment) {
        this.analysis = analysis;
        this.task = task;
        this.checked = checked;
        this.aiComment = aiComment;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Analysis getAnalysis() {
        return analysis;
    }
    
    public void setAnalysis(Analysis analysis) {
        this.analysis = analysis;
    }
    
    public Task getTask() {
        return task;
    }
    
    public void setTask(Task task) {
        this.task = task;
    }
    
    public Boolean getChecked() {
        return checked;
    }
    
    public void setChecked(Boolean checked) {
        this.checked = checked;
    }
    
    public String getAiComment() {
        return aiComment;
    }
    
    public void setAiComment(String aiComment) {
        this.aiComment = aiComment;
    }
    
    public boolean isChecked() {
        return checked != null && checked;
    }
}