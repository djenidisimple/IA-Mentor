package com.djenidi.ai_mentor.controller;

import com.djenidi.ai_mentor.dto.request.LoginRequest;
import com.djenidi.ai_mentor.dto.request.OAuth2ExchangeRequest;
import com.djenidi.ai_mentor.dto.request.RegisterRequest;
import com.djenidi.ai_mentor.dto.response.AuthResponse;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.ResourceNotFoundException;
import com.djenidi.ai_mentor.exception.TokenException;
import com.djenidi.ai_mentor.repository.UserRepository;
import com.djenidi.ai_mentor.security.JwtService;
import com.djenidi.ai_mentor.security.OAuth2CodeStore;
import com.djenidi.ai_mentor.security.RefreshTokenCookieService;
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

    private final AuthService                 authService;
    private final RefreshTokenService         refreshTokenService;
    private final RefreshTokenCookieService   cookieService;
    private final OAuth2CodeStore             oAuth2CodeStore;
    private final UserRepository              userRepository;
    private final JwtService                  jwtService;

    // ── POST /api/auth/register ───────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.register(request);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", request.getEmail()));

        issueSession(user, httpRequest, response);

        return ResponseEntity.ok(authResponse);
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.login(request);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", "email", request.getEmail()));

        issueSession(user, httpRequest, response);

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

        RefreshTokenService.IssuedSession issued = refreshTokenService.validateAndRotate(rawToken);
        User user = issued.session().getUser();

        cookieService.write(response, issued.rawToken());

        return ResponseEntity.ok(buildAuthResponse(user, jwtService.generateToken(user)));
    }

    // ── POST /api/auth/oauth2/exchange ────────────────────────────────────────
    /**
     * Échange le code à usage unique reçu en fin de flux OAuth2 contre un JWT.
     * Remplace l'ancien passage du JWT directement dans l'URL de redirection.
     */
    @PostMapping("/oauth2/exchange")
    public ResponseEntity<AuthResponse> exchangeOAuth2Code(
            @Valid @RequestBody OAuth2ExchangeRequest body,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        Long userId = oAuth2CodeStore.consume(body.getCode());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new TokenException("Utilisateur du code OAuth2 introuvable"));

        issueSession(user, httpRequest, response);

        return ResponseEntity.ok(buildAuthResponse(user, jwtService.generateToken(user)));
    }

    // ── POST /api/auth/logout ─────────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String rawToken = extractRefreshTokenFromCookie(request);
        refreshTokenService.revoke(rawToken);
        cookieService.clear(response);
        return ResponseEntity.noContent().build();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private void issueSession(User user, HttpServletRequest request, HttpServletResponse response) {
        RefreshTokenService.IssuedSession issued =
                refreshTokenService.createSession(user, request.getHeader("User-Agent"));
        cookieService.write(response, issued.rawToken());
    }

    private AuthResponse buildAuthResponse(User user, String jwt) {
        return AuthResponse.builder()
                .id(user.getId())
                .token(jwt)
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        String cookieName = cookieService.getName();
        return Arrays.stream(request.getCookies())
                .filter(c -> cookieName.equals(c.getName()))
                .map(jakarta.servlet.http.Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
