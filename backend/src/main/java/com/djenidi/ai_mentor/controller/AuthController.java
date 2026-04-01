package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.request.LoginRequest;
import com.djenidi.ai_mentor.dto.request.RegisterRequest;
import com.djenidi.ai_mentor.dto.response.AuthResponse;
import com.djenidi.ai_mentor.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity
                .ok(authService.login(request));
    }
}
