package com.djenidi.ai_mentor.models;

import java.security.Timestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "analysis")
public class Analysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer submissionId;
    private Float overallScore;
    private String reportText;
    private Timestamp analysisDate;

    /**
     * @return Long return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return Integer return the submissionId
     */
    public Integer getSubmissionId() {
        return submissionId;
    }

    /**
     * @param submissionId the submissionId to set
     */
    public void setSubmissionId(Integer submissionId) {
        this.submissionId = submissionId;
    }

    /**
     * @return Float return the overallScore
     */
    public Float getOverallScore() {
        return overallScore;
    }

    /**
     * @param overallScore the overallScore to set
     */
    public void setOverallScore(Float overallScore) {
        this.overallScore = overallScore;
    }

    /**
     * @return String return the reportText
     */
    public String getReportText() {
        return reportText;
    }

    /**
     * @param reportText the reportText to set
     */
    public void setReportText(String reportText) {
        this.reportText = reportText;
    }

    /**
     * @return Timestamp return the analysisDate
     */
    public Timestamp getAnalysisDate() {
        return analysisDate;
    }

    /**
     * @param analysisDate the analysisDate to set
     */
    public void setAnalysisDate(Timestamp analysisDate) {
        this.analysisDate = analysisDate;
    }

}
