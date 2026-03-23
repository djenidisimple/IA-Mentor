package com.djenidi.ai_mentor.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "analysis")
public class Analysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonBackReference 
    private Submission submission;
    
    @Column(name = "overall_score")
    private Float overallScore;
    
    @Column(name = "report_text", columnDefinition = "TEXT")
    private String reportText;
    
    @Column(name = "analysis_date")
    private LocalDateTime analysisDate;
    
    // Constructeurs
    public Analysis() {}
    
    public Analysis(Submission submission, Float overallScore, String reportText, LocalDateTime analysisDate) {
        this.submission = submission;
        this.overallScore = overallScore;
        this.reportText = reportText;
        this.analysisDate = analysisDate;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Submission getSubmission() {
        return submission;
    }
    
    public void setSubmission(Submission submission) {
        this.submission = submission;
    }
    
    public Float getOverallScore() {
        return overallScore;
    }
    
    public void setOverallScore(Float overallScore) {
        this.overallScore = overallScore;
    }
    
    public String getReportText() {
        return reportText;
    }
    
    public void setReportText(String reportText) {
        this.reportText = reportText;
    }
    
    public LocalDateTime getAnalysisDate() {
        return analysisDate;
    }
    
    public void setAnalysisDate(LocalDateTime analysisDate) {
        this.analysisDate = analysisDate;
    }
}