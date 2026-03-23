package com.djenidi.ai_mentor.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.djenidi.ai_mentor.models.Submission;
import com.djenidi.ai_mentor.models.User;
import com.djenidi.ai_mentor.models.Project;
import com.djenidi.ai_mentor.repository.AnalysisRepository;
import com.djenidi.ai_mentor.repository.ProjectRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;

@Service
@Transactional
public class SubmissionService {
    
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final AnalysisRepository analysisRepository;
    private final AnalysisService analysisService;  // Pour déclencher l'analyse
    
    public SubmissionService(SubmissionRepository submissionRepository, 
                             UserRepository userRepository, 
                             ProjectRepository projectRepository, 
                             AnalysisRepository analysisRepository,
                             AnalysisService analysisService) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.analysisRepository = analysisRepository;
        this.analysisService = analysisService;
    }
    
    /**
     * Soumet un projet
     */
    public Submission submitProject(Submission submission) {
        // Vérifier que l'utilisateur existe
        User user = userRepository.findById(submission.getUser().getId())
            .orElseThrow(() -> new RuntimeException("User not found with id: " + submission.getUser().getId()));
        
        // Vérifier que le projet existe
        Project project = projectRepository.findById(submission.getProject().getId())
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + submission.getProject().getId()));
        
        // Vérifier si l'utilisateur n'a pas déjà soumis pour ce projet
        if (submissionRepository.findByUserIdAndProjectId(user.getId(), project.getId()).isPresent()) {
            throw new RuntimeException("User already submitted for this project");
        }
        
        // Définir la date de soumission
        submission.setSubmissionDate(LocalDateTime.now());
        
        // Associer les entités
        submission.setUser(user);
        submission.setProject(project);
        
        // Sauvegarder la soumission
        Submission savedSubmission = submissionRepository.save(submission);
        
        // Déclencher l'analyse automatique (asynchrone)
        analysisService.analyzeSubmission(savedSubmission.getId());
        
        return savedSubmission;
    }
    
    /**
     * Récupère toutes les soumissions d'un utilisateur
     */
    public List<Submission> getSubmissionsByUser(Long userId) {
        // Vérifier que l'utilisateur existe
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        return submissionRepository.findByUserId(userId);
    }
    
    /**
     * Récupère toutes les soumissions d'un projet
     */
    public List<Submission> getSubmissionsByProject(Long projectId) {
        // Vérifier que le projet existe
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
        
        return submissionRepository.findByProjectId(projectId);
    }
    
    /**
     * Récupère une soumission par son ID
     */
    public Submission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Submission not found with id: " + id));
    }
    
    /**
     * Récupère une soumission par utilisateur et projet
     */
    public Optional<Submission> getSubmissionByUserAndProject(Long userId, Long projectId) {
        return submissionRepository.findByUserIdAndProjectId(userId, projectId);
    }
    
    /**
     * Récupère toutes les soumissions
     */
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }
    
    /**
     * Met à jour une soumission
     */
    public Submission updateSubmission(Long id, Submission submissionDetails) {
        Submission submission = getSubmissionById(id);
        
        if (submissionDetails.getGithubUrl() != null) {
            submission.setGithubUrl(submissionDetails.getGithubUrl());
        }
        
        if (submissionDetails.getExplanation() != null) {
            submission.setExplanation(submissionDetails.getExplanation());
        }
        
        // Vérifier si la soumission a déjà été analysée
        if (analysisRepository.findBySubmissionId(id).isPresent()) {
            throw new RuntimeException("Cannot update submission that has already been analyzed");
        }
        
        return submissionRepository.save(submission);
    }
    
    /**
     * Supprime une soumission
     */
    public void deleteSubmission(Long id) {
        Submission submission = getSubmissionById(id);
        
        // Vérifier si la soumission a déjà été analysée
        if (analysisRepository.findBySubmissionId(id).isPresent()) {
            throw new RuntimeException("Cannot delete submission that has already been analyzed");
        }
        
        submissionRepository.deleteById(id);
    }
    
    /**
     * Vérifie si un utilisateur a déjà soumis pour un projet
     */
    public boolean hasUserSubmittedForProject(Long userId, Long projectId) {
        return submissionRepository.findByUserIdAndProjectId(userId, projectId).isPresent();
    }
    
    /**
     * Compte les soumissions d'un utilisateur
     */
    public long countSubmissionsByUser(Long userId) {
        return submissionRepository.countByUserId(userId);
    }
    
    /**
     * Compte les soumissions d'un projet
     */
    public long countSubmissionsByProject(Long projectId) {
        return submissionRepository.countByProjectId(projectId);
    }
    
    /**
     * Récupère les soumissions récentes (derniers 7 jours)
     */
    public List<Submission> getRecentSubmissions() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        return submissionRepository.findBySubmissionDateAfter(oneWeekAgo);
    }
}
