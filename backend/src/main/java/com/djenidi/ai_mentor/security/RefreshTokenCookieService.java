package com.djenidi.ai_mentor.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Fabrique du cookie portant le refresh token.
 *
 * <p>Tous les attributs sont configurables par propriété afin de pouvoir passer
 * {@code Secure} à {@code true} en production sans toucher au code.</p>
 */
@Component
public class RefreshTokenCookieService {

    @Value("${app.cookie.refresh-token.name:refresh_token}")
    private String cookieName;

    @Value("${app.cookie.refresh-token.path:/api/auth}")
    private String cookiePath;

    @Value("${app.cookie.refresh-token.secure:false}")
    private boolean secure;

    @Value("${app.cookie.refresh-token.same-site:Strict}")
    private String sameSite;

    @Value("${app.cookie.refresh-token.domain:}")
    private String domain;

    @Value("${application.security.jwt.refresh-expiration:90}")
    private long refreshExpirationDays;

    public void write(HttpServletResponse response, String rawToken) {
        response.addHeader(HttpHeaders.SET_COOKIE, build(rawToken, Duration.ofSeconds(maxAgeSeconds())).toString());
    }

    public void clear(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, build("", Duration.ZERO).toString());
    }

    public String getName() {
        return cookieName;
    }

    public long maxAgeSeconds() {
        return refreshExpirationDays * 24 * 3600;
    }

    private ResponseCookie build(String value, Duration maxAge) {
        ResponseCookie.ResponseCookieBuilder builder = ResponseCookie
                .from(cookieName, value)
                .httpOnly(true)
                .secure(secure)
                .path(cookiePath)
                .sameSite(sameSite)
                .maxAge(maxAge);

        if (domain != null && !domain.isBlank()) {
            builder.domain(domain);
        }

        return builder.build();
    }
}
