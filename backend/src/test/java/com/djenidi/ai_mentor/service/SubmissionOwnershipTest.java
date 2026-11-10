package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.entity.Challenge;
import com.djenidi.ai_mentor.entity.Submission;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.ChallengeRepository;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionOwnershipTest {
    @Mock SubmissionRepository submissionRepository;
    @Mock UserRepository userRepository;
    @Mock ChallengeRepository challengeRepository;
    @Mock AnalysisService analysisService;
    @InjectMocks SubmissionService submissionService;

    @Test
    void rejectsRepositoryOwnedByAnotherGithubAccountWithoutSaving() {
        Submission submission = submission("alice");
        when(submissionRepository.findByUserIdAndChallengeId(1L, 2L)).thenReturn(Optional.of(submission));

        assertThrows(AccessDeniedException.class, () ->
                submissionService.submitChallenge(1L, 2L, "https://github.com/bob/project", null));

        verify(submissionRepository, never()).save(any());
        verifyNoInteractions(analysisService);
    }

    @Test
    void requiresGithubAccountToBeLinked() {
        Submission submission = submission(null);
        when(submissionRepository.findByUserIdAndChallengeId(1L, 2L)).thenReturn(Optional.of(submission));

        assertThrows(AccessDeniedException.class, () ->
                submissionService.submitChallenge(1L, 2L, "https://github.com/alice/project", null));

        verify(submissionRepository, never()).save(any());
        verifyNoInteractions(analysisService);
    }

    @Test
    void acceptsOwnRepositoryCaseInsensitivelyAndSavesComment() {
        Submission submission = submission("Alice");
        when(submissionRepository.findByUserIdAndChallengeId(1L, 2L)).thenReturn(Optional.of(submission));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(invocation -> invocation.getArgument(0));

        submissionService.submitChallenge(1L, 2L, "https://github.com/alice/my-project.git", "  My notes  ");

        assertEquals(SubmissionStatus.SUBMITTED, submission.getStatus());
        assertEquals("My notes", submission.getUserComment());
        verify(analysisService).analyzeSubmission(submission.getId());
    }

    @Test
    void rejectsNonRepositoryUrls() {
        Submission submission = submission("alice");
        when(submissionRepository.findByUserIdAndChallengeId(1L, 2L)).thenReturn(Optional.of(submission));

        assertThrows(IllegalArgumentException.class, () ->
                submissionService.submitChallenge(1L, 2L, "https://github.com/alice/project/tree/main", null));

        verify(submissionRepository, never()).save(any());
    }

    private Submission submission(String githubUsername) {
        User user = User.builder()
                .id(1L)
                .username("platform-user")
                .email("user@example.com")
                .githubUsername(githubUsername)
                .build();
        Challenge challenge = Challenge.builder()
                .id(2L)
                .title("Test challenge")
                .slug("test-challenge")
                .build();
        return Submission.builder()
                .id(3L)
                .user(user)
                .challenge(challenge)
                .status(SubmissionStatus.IN_PROGRESS)
                .build();
    }
}
