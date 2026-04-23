// src/main/java/com/djenidi/ai_mentor/service/RefreshTokenService.java
package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.entity.RefreshToken;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.TokenException;
import com.djenidi.ai_mentor.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${app.jwt.refresh-expiration-days:90}")
    private long refreshExpirationDays;

    private final RefreshTokenRepository refreshTokenRepository;

    // ── Créer ou renouveler (sliding window) ──────────────────────────────────
    @Transactional
    public RefreshToken createOrRenew(User user) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByUser(user)
                .orElse(RefreshToken.builder().user(user).build());

        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusSeconds(refreshExpirationDays * 24 * 3600));
        refreshToken.setRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }

    // ── Valider + rotation ────────────────────────────────────────────────────
    @Transactional
    public RefreshToken validateAndRotate(String rawToken) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(rawToken)
                .orElseThrow(() -> new TokenException("Refresh token introuvable"));

        if (refreshToken.isRevoked()) {
            throw new TokenException("Refresh token révoqué");
        }

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new TokenException("Refresh token expiré — veuillez vous reconnecter");
        }

        // Sliding window : nouveau token UUID + nouvelle expiration
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusSeconds(refreshExpirationDays * 24 * 3600));

        return refreshTokenRepository.save(refreshToken);
    }

    // ── Révoquer par user (logout) ────────────────────────────────────────────
    @Transactional
    public void revokeByUser(User user) {
        refreshTokenRepository.findByUser(user).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    // ── Révoquer par valeur du token ──────────────────────────────────────────
    @Transactional
    public void revokeByToken(String rawToken) {
        refreshTokenRepository.findByToken(rawToken).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    // ── Nettoyage automatique chaque nuit à 2h ────────────────────────────────
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupExpiredTokens() {
        log.info("Nettoyage des refresh tokens expirés...");
        refreshTokenRepository.deleteExpiredAndRevoked(Instant.now());
    }
}
