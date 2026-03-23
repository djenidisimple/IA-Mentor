package com.djenidi.ai_mentor.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "taskResult")
public class TaskResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer analysisId;
    private Integer taskId;
    private Boolean checked;
    private String aiComment;

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
     * @return Integer return the analysisId
     */
    public Integer getAnalysisId() {
        return analysisId;
    }

    /**
     * @param analysisId the analysisId to set
     */
    public void setAnalysisId(Integer analysisId) {
        this.analysisId = analysisId;
    }

    /**
     * @return Integer return the taskId
     */
    public Integer getTaskId() {
        return taskId;
    }

    /**
     * @param taskId the taskId to set
     */
    public void setTaskId(Integer taskId) {
        this.taskId = taskId;
    }

    /**
     * @return Boolean return the checked
     */
    public Boolean isChecked() {
        return checked;
    }

    /**
     * @param checked the checked to set
     */
    public void setChecked(Boolean checked) {
        this.checked = checked;
    }

    /**
     * @return String return the aiComment
     */
    public String getAiComment() {
        return aiComment;
    }

    /**
     * @param aiComment the aiComment to set
     */
    public void setAiComment(String aiComment) {
        this.aiComment = aiComment;
    }

}
