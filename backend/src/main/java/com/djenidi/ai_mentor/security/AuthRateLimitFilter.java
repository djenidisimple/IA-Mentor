package com.djenidi.ai_mentor.security;

import com.djenidi.ai_mentor.dto.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Limitation de débit simple (fenêtre glissante en mémoire) sur les endpoints
 * d'authentification, pour freiner le brute-force et l'abus de /refresh.
 *
 * <p>En mémoire : suffisant pour une instance unique. Déploiement multi-instances
 * → Redis ou équivalent.</p>
 */
@Component
@RequiredArgsConstructor
public class AuthRateLimitFilter extends OncePerRequestFilter {

    private static final Set<String> PROTECTED_ENDPOINTS = Set.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/api/auth/oauth2/exchange"
    );

    private static final int MAX_TRACKED_CLIENTS = 10_000;

    private final ObjectMapper objectMapper;

    @Value("${app.rate-limit.auth.max-requests:20}")
    private int maxRequests;

    @Value("${app.rate-limit.auth.window-seconds:60}")
    private long windowSeconds;

    private final Map<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();
        if (!"POST".equalsIgnoreCase(request.getMethod()) || !PROTECTED_ENDPOINTS.contains(uri)) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = request.getRemoteAddr() + "|" + uri;
        if (isRateLimited(key)) {
            writeTooManyRequests(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isRateLimited(String key) {
        if (hits.size() > MAX_TRACKED_CLIENTS) {
            purgeStaleEntries();
        }

        long now = System.currentTimeMillis();
        long windowStart = now - windowSeconds * 1000;

        Deque<Long> timestamps = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst() < windowStart) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= maxRequests) {
                return true;
            }
            timestamps.addLast(now);
            return false;
        }
    }

    private void purgeStaleEntries() {
        long windowStart = System.currentTimeMillis() - windowSeconds * 1000;
        hits.entrySet().removeIf(entry -> {
            Deque<Long> timestamps = entry.getValue();
            synchronized (timestamps) {
                return timestamps.isEmpty() || timestamps.peekLast() < windowStart;
            }
        });
    }

    private void writeTooManyRequests(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(windowSeconds));
        objectMapper.writeValue(response.getWriter(),
                ApiResponse.error("Trop de tentatives. Réessayez dans " + windowSeconds + " secondes."));
        logger.warn("Limite de débit atteinte pour " + request.getRequestURI() + " depuis " + request.getRemoteAddr());
    }
}
