package com.djenidi.ai_mentor.service;

import com.djenidi.ai_mentor.entity.AuthSession;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.TokenException;
import com.djenidi.ai_mentor.repository.AuthSessionRepository;
import com.djenidi.ai_mentor.security.TokenHasher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

/**
 * Gestion des refresh tokens : une session par appareil, rotation systématique,
 * stockage haché et détection de rejeu.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int RAW_TOKEN_BYTES = 32;
    private static final int USER_AGENT_MAX_LENGTH = 512;

    /** Durée de vie d'une session, en jours (propriété alignée sur application.properties). */
    @Value("${application.security.jwt.refresh-expiration:90}")
    private long refreshExpirationDays;

    /** Fenêtre tolérée pendant laquelle l'ancien token reste accepté (course entre onglets). */
    @Value("${application.security.jwt.refresh-grace-seconds:30}")
    private long refreshGraceSeconds;

    /** Nombre maximum de sessions simultanées par utilisateur (appareils). */
    @Value("${application.security.jwt.max-sessions:10}")
    private int maxSessions;

    private final AuthSessionRepository sessionRepository;

    /** Couple (session persistée, token en clair) : le token en clair ne sert qu'au cookie. */
    public record IssuedSession(AuthSession session, String rawToken) {
    }

    // ── Création d'une nouvelle session (login, register, OAuth2) ─────────────

    @Transactional
    public IssuedSession createSession(User user, String userAgent) {
        String rawToken = generateRawToken();

        AuthSession session = AuthSession.builder()
                .user(user)
                .tokenHash(TokenHasher.hash(rawToken))
                .expiryDate(newExpiry())
                .userAgent(truncateUserAgent(userAgent))
                .build();

        AuthSession saved = sessionRepository.save(session);
        revokeOverflowSessions(user);

        log.debug("Nouvelle session de rafraîchissement pour l'utilisateur {}", user.getUsername());
        return new IssuedSession(saved, rawToken);
    }

    // ── Validation + rotation ─────────────────────────────────────────────────

    @Transactional
    public IssuedSession validateAndRotate(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new TokenException("Refresh token manquant");
        }

        String hash = TokenHasher.hash(rawToken);

        Optional<AuthSession> current = sessionRepository.findByTokenHash(hash);
        if (current.isPresent()) {
            return rotate(current.get());
        }

        // Le token n'est plus le token courant : il s'agit peut-être du token
        // précédent, encore valide pendant la fenêtre de grâce.
        AuthSession replayed = sessionRepository.findByPreviousTokenHash(hash)
                .orElseThrow(() -> new TokenException("Refresh token introuvable"));

        if (replayed.isRevoked()) {
            throw new TokenException("Refresh token révoqué");
        }

        boolean withinGrace = replayed.getPreviousTokenValidUntil() != null
                && replayed.getPreviousTokenValidUntil().isAfter(Instant.now());

        if (withinGrace) {
            // Deux onglets ont rafraîchi en même temps : on tourne à nouveau
            // au lieu de casser la session.
            log.debug("Réutilisation du token précédent dans la fenêtre de grâce — rotation tolérée");
            return rotate(replayed);
        }

        // Rejeu hors fenêtre : la session est compromise, on révoque tout.
        int revoked = sessionRepository.revokeAllByUser(replayed.getUser());
        log.warn("Rejeu de refresh token détecté (utilisateur {}, {} session(s) révoquée(s))",
                replayed.getUser().getUsername(), revoked);
        throw new TokenException("Refresh token réutilisé — toutes les sessions ont été révoquées");
    }

    // ── Révocation ────────────────────────────────────────────────────────────

    @Transactional
    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }
        String hash = TokenHasher.hash(rawToken);
        sessionRepository.findByTokenHash(hash)
                .or(() -> sessionRepository.findByPreviousTokenHash(hash))
                .ifPresent(session -> {
                    session.setRevoked(true);
                    sessionRepository.save(session);
                });
    }

    @Transactional
    public void revokeAll(User user) {
        sessionRepository.revokeAllByUser(user);
    }

    // ── Nettoyage automatique chaque nuit à 2h ────────────────────────────────

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupExpiredTokens() {
        int deleted = sessionRepository.deleteExpiredAndRevoked(Instant.now());
        log.info("Nettoyage des sessions expirées/révoquées : {} ligne(s) supprimée(s)", deleted);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private IssuedSession rotate(AuthSession session) {
        if (session.isRevoked()) {
            throw new TokenException("Refresh token révoqué");
        }
        if (session.getExpiryDate().isBefore(Instant.now())) {
            session.setRevoked(true);
            sessionRepository.save(session);
            throw new TokenException("Refresh token expiré — veuillez vous reconnecter");
        }

        String rawToken = generateRawToken();
        session.setPreviousTokenHash(session.getTokenHash());
        session.setPreviousTokenValidUntil(Instant.now().plusSeconds(refreshGraceSeconds));
        session.setTokenHash(TokenHasher.hash(rawToken));
        session.setExpiryDate(newExpiry());
        session.setLastUsedAt(Instant.now());

        return new IssuedSession(sessionRepository.save(session), rawToken);
    }

    /** Révoque les sessions les plus anciennes au-delà de la limite configurée. */
    private void revokeOverflowSessions(User user) {
        if (maxSessions < 1) {
            return;
        }
        List<AuthSession> activeSessions = sessionRepository
                .findByUserAndRevokedFalseOrderByCreatedAtAsc(user);

        int overflow = activeSessions.size() - maxSessions;
        if (overflow <= 0) {
            return;
        }

        for (int i = 0; i < overflow; i++) {
            activeSessions.get(i).setRevoked(true);
        }
        sessionRepository.saveAll(activeSessions.subList(0, overflow));
        log.debug("{} session(s) la plus ancienne(s) révoquée(s) pour {}", overflow, user.getUsername());
    }

    private String generateRawToken() {
        byte[] bytes = new byte[RAW_TOKEN_BYTES];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private Instant newExpiry() {
        return Instant.now().plusSeconds(refreshExpirationDays * 24 * 3600);
    }

    private String truncateUserAgent(String userAgent) {
        if (userAgent == null) {
            return null;
        }
        return userAgent.length() > USER_AGENT_MAX_LENGTH
                ? userAgent.substring(0, USER_AGENT_MAX_LENGTH)
                : userAgent;
    }
}
