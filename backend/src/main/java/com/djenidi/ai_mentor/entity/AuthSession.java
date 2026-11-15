package com.djenidi.ai_mentor.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Session de rafraîchissement, une par appareil / navigateur.
 *
 * <p>Contrairement à l'ancienne table {@code refresh_tokens} (une seule ligne par
 * utilisateur), cette table autorise plusieurs sessions simultanées : se connecter
 * sur un second appareil ne déconnecte plus le premier.</p>
 *
 * <p>Seule l'empreinte SHA-256 du token est stockée, jamais le token en clair.</p>
 */
@Entity
@Table(
        name = "auth_sessions",
        indexes = {
                @Index(name = "idx_auth_sessions_user", columnList = "user_id"),
                @Index(name = "idx_auth_sessions_token_hash", columnList = "token_hash"),
                @Index(name = "idx_auth_sessions_previous_hash", columnList = "previous_token_hash")
        }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * EAGER volontaire : le contrôleur a besoin de l'utilisateur juste après la
     * validation, en dehors de la transaction du service.
     */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Empreinte SHA-256 (hex) du refresh token actif. */
    @Column(name = "token_hash", nullable = false, unique = true, length = 64)
    private String tokenHash;

    /** Empreinte du token précédent, conservée pendant la fenêtre de grâce. */
    @Column(name = "previous_token_hash", length = 64)
    private String previousTokenHash;

    /** Fin de la fenêtre de grâce accordée au token précédent (anti-course multi-onglets). */
    @Column(name = "previous_token_valid_until")
    private Instant previousTokenValidUntil;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    @Builder.Default
    @Column(nullable = false)
    private boolean revoked = false;

    /** User-Agent tronqué, pour permettre à l'utilisateur d'identifier ses sessions. */
    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "last_used_at")
    private Instant lastUsedAt;
}
