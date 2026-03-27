package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.UserProfileResponse;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal User user) {
        UserProfileResponse profile = userService.getUserProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
