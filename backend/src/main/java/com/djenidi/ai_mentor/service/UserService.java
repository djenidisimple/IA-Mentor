package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.dto.response.UserProfileResponse;
import com.djenidi.ai_mentor.entity.SubmissionStatus;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.repository.SubmissionRepository;
import com.djenidi.ai_mentor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "id", userId));

        long inProgress = submissionRepository.countByUserIdAndStatus(userId, SubmissionStatus.IN_PROGRESS);
        long completed = submissionRepository.countByUserIdAndStatus(userId, SubmissionStatus.REVIEWED);

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .points(user.getPoints())
                .isPremium(user.getIsPremium())
                .challengesInProgress(inProgress)
                .challengesCompleted(completed)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
