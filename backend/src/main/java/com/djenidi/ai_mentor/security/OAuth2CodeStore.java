package com.djenidi.ai_mentor.security;

import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.exception.TokenException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Codes à usage unique échangés contre un JWT à la fin du flux OAuth2.
 *
 * <p>Le JWT n'est plus transmis dans l'URL de redirection (où il pouvait fuiter
 * via l'historique, les logs ou le header {@code Referer}) : seul un code opaque,
 * valable quelques secondes et utilisable une seule fois, transite dans l'URL.</p>
 *
 * <p>Stockage en mémoire : adapté à un déploiement mono-instance. Pour un
 * déploiement multi-instances, remplacer par Redis ou une table dédiée.</p>
 */
@Slf4j
@Component
public class OAuth2CodeStore {

    private static final int MAX_PENDING_CODES = 10_000;

    @Value("${app.oauth2.code-ttl-seconds:60}")
    private long codeTtlSeconds;

    private final Map<String, CodeEntry> codes = new ConcurrentHashMap<>();

    private record CodeEntry(Long userId, Instant expiresAt) {
    }

    public String issue(User user) {
        if (codes.size() >= MAX_PENDING_CODES) {
            purge();
        }
        String code = UUID.randomUUID().toString();
        codes.put(code, new CodeEntry(user.getId(), Instant.now().plusSeconds(codeTtlSeconds)));
        return code;
    }

    /**
     * Consomme le code (usage unique) et retourne l'identifiant de l'utilisateur.
     *
     * @throws TokenException si le code est inconnu, déjà utilisé ou expiré
     */
    public Long consume(String code) {
        if (code == null || code.isBlank()) {
            throw new TokenException("Code OAuth2 manquant");
        }
        CodeEntry entry = codes.remove(code);
        if (entry == null) {
            throw new TokenException("Code OAuth2 invalide ou déjà utilisé");
        }
        if (entry.expiresAt().isBefore(Instant.now())) {
            throw new TokenException("Code OAuth2 expiré");
        }
        return entry.userId();
    }

    @Scheduled(fixedDelay = 60_000)
    public void purge() {
        Instant now = Instant.now();
        int before = codes.size();
        codes.entrySet().removeIf(entry -> entry.getValue().expiresAt().isBefore(now));
        int removed = before - codes.size();
        if (removed > 0) {
            log.debug("{} code(s) OAuth2 expiré(s) purgé(s)", removed);
        }
    }
}
