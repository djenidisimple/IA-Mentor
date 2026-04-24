package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.request.LoginRequest;
import com.djenidi.ai_mentor.dto.request.RegisterRequest;
import com.djenidi.ai_mentor.dto.response.AuthResponse;
import com.djenidi.ai_mentor.entity.RefreshToken;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.TokenException;
import com.djenidi.ai_mentor.repository.UserRepository;
import com.djenidi.ai_mentor.security.JwtService;
import com.djenidi.ai_mentor.service.AuthService;
import com.djenidi.ai_mentor.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService         authService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository      userRepository;
    private final JwtService          jwtService;

    private static final int    COOKIE_MAX_AGE = 90 * 24 * 60 * 60;
    private static final String COOKIE_NAME    = "refresh_token";

    // ── POST /api/auth/register ───────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        // 1. Logique existante inchangée → crée user + retourne AuthResponse avec JWT
        AuthResponse authResponse = authService.register(request);

        // 2. Récupérer le user pour créer le refresh token
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // 3. Refresh token en cookie HttpOnly
        RefreshToken refreshToken = refreshTokenService.createOrRenew(user);
        setRefreshTokenCookie(response, refreshToken.getToken());

        return ResponseEntity.ok(authResponse);
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        // 1. Logique existante inchangée
        AuthResponse authResponse = authService.login(request);

        // 2. Récupérer le user
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // 3. Refresh token en cookie HttpOnly
        RefreshToken refreshToken = refreshTokenService.createOrRenew(user);
        setRefreshTokenCookie(response, refreshToken.getToken());

        return ResponseEntity.ok(authResponse);
    }

    // ── POST /api/auth/refresh ────────────────────────────────────────────────
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String rawToken = extractRefreshTokenFromCookie(request);

        if (rawToken == null) {
            throw new TokenException("Refresh token manquant");
        }

        // Valide + rotation sliding window
        RefreshToken refreshToken = refreshTokenService.validateAndRotate(rawToken);
        User user = refreshToken.getUser();

        // Nouveau JWT (15 min)
        String newJwt = jwtService.generateToken(user);

        // Nouveau cookie avec token rotatif
        setRefreshTokenCookie(response, refreshToken.getToken());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(newJwt)
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build());
    }

    // ── POST /api/auth/logout ─────────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String rawToken = extractRefreshTokenFromCookie(request);
        if (rawToken != null) {
            refreshTokenService.revokeByToken(rawToken);
        }
        clearRefreshTokenCookie(response);
        return ResponseEntity.noContent().build();
    }

    // ── Helpers cookie ────────────────────────────────────────────────────────

    private void setRefreshTokenCookie(HttpServletResponse response, String tokenValue) {
        response.addHeader("Set-Cookie",
            COOKIE_NAME + "=" + tokenValue
            + "; Max-Age=" + COOKIE_MAX_AGE
            + "; Path=/api/auth"
            + "; HttpOnly"
            // + "; Secure" // Désactivé pour le développement local en HTTP
            + "; SameSite=Strict"
        );
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        response.addHeader("Set-Cookie",
            COOKIE_NAME + "="
            + "; Max-Age=0"
            + "; Path=/api/auth"
            + "; HttpOnly"
            // + "; Secure" // Désactivé pour le développement local en HTTP
            + "; SameSite=Strict"
        );
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> COOKIE_NAME.equals(c.getName()))
                .map(jakarta.servlet.http.Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
