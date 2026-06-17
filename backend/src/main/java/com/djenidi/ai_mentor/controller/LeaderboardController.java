package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.djenidi.ai_mentor.dto.response.LeaderboardEntryDTO;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<ApiResponse<List<LeaderboardEntryDTO>>> getLeaderboard() {
        return ResponseEntity.ok(ApiResponse.success(leaderboardService.getLeaderboard()));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<ApiResponse<LeaderboardEntryDTO>> getMyRank(@AuthenticationPrincipal User user) {
        LeaderboardEntryDTO entry = leaderboardService.getCurrentUserRank(user);
        if (entry == null) {
            return ResponseEntity.ok(ApiResponse.error("Utilisateur non trouvé dans le classement"));
        }
        return ResponseEntity.ok(ApiResponse.success(entry));
    }
}
