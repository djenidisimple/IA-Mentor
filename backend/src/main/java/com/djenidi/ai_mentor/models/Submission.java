package com.djenidi.ai_mentor.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "submissions")
public class Submission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Correction: @ManyToOne doit référencer l'objet User complet
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference  // Évite les boucles infinies
    private User user;
    
    // Correction: @ManyToOne doit référencer l'objet Project complet
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @JsonBackReference
    private Project project;
    
    @Column(name = "github_url")
    private String githubUrl;
    
    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;
    
    @Column(name = "submission_date")
    private LocalDateTime submissionDate;
    
    // Relation OneToOne avec Analysis
    @OneToOne(mappedBy = "submission", cascade = CascadeType.ALL)
    private Analysis analysis;
    
    // Constructeurs
    public Submission() {}
    
    public Submission(User user, Project project, String githubUrl, 
                      String explanation, LocalDateTime submissionDate) {
        this.user = user;
        this.project = project;
        this.githubUrl = githubUrl;
        this.explanation = explanation;
        this.submissionDate = submissionDate;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Project getProject() {
        return project;
    }
    
    public void setProject(Project project) {
        this.project = project;
    }
    
    public String getGithubUrl() {
        return githubUrl;
    }
    
    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }
    
    public String getExplanation() {
        return explanation;
    }
    
    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
    
    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }
    
    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }
    
    public Analysis getAnalysis() {
        return analysis;
    }
    
    public void setAnalysis(Analysis analysis) {
        this.analysis = analysis;
    }
    
    // Méthode utilitaire pour faciliter la création
    public static Submission createSubmission(User user, Project project, String githubUrl, String explanation) {
        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProject(project);
        submission.setGithubUrl(githubUrl);
        submission.setExplanation(explanation);
        submission.setSubmissionDate(LocalDateTime.now());
        return submission;
    }
}