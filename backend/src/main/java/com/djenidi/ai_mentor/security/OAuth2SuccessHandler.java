package com.djenidi.ai_mentor.security;

import com.djenidi.ai_mentor.entity.RefreshToken;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.repository.UserRepository;
import com.djenidi.ai_mentor.service.RefreshTokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    private static final int COOKIE_MAX_AGE = 90 * 24 * 60 * 60;
    private static final String COOKIE_NAME = "refresh_token";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        
        if (email == null) {
            String login = oauth2User.getAttribute("login");
            email = login + "@github.com";
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé après OAuth2"));

        // 1. Générer le JWT
        String token = jwtService.generateToken(user);

        // 2. CRUCIAL : Générer le Refresh Token et l'ajouter au cookie
        RefreshToken refreshToken = refreshTokenService.createOrRenew(user);
        setRefreshTokenCookie(response, refreshToken.getToken());

        // 3. Redirection vers le front
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/callback")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String tokenValue) {
        response.addHeader("Set-Cookie",
            COOKIE_NAME + "=" + tokenValue
            + "; Max-Age=" + COOKIE_MAX_AGE
            + "; Path=/api/auth"
            + "; HttpOnly"
            + "; SameSite=Strict"
        );
    }
}