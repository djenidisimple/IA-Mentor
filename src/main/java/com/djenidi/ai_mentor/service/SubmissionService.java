package com.djenidi.ai_mentor.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.djenidi.ai_mentor.models.Submission;
import com.djenidi.ai_mentor.repository.AnalysisRepository;
import com.djenidi.ai_mentor.repository.ProjectRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;

@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;

    public SubmissionService(SubmissionRepository submissionRepository, UserRepository userRepository, ProjectRepository projectRepository, AnalysisRepository analysisRepository) {
        this.submissionRepository = submissionRepository;
    }

    public Submission SubmitProject(Submission submission) {
        if (submissionRepository.findByUserIdAndProjectId(submission.getUserId(), submission.getProjectId()).isPresent()) {
            throw new RuntimeException("User already submitted for this project");
        }

        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByUser(Long userId) {
        return submissionRepository.findByUserId(userId);
    }

    public Submission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    public Optional<Submission> getSubmissionsByUserAndProject(Long userId, Long projectId) {
        return submissionRepository.findByUserIdAndProjectId(userId, projectId);
    }
}
