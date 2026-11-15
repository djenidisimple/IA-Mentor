package com.djenidi.ai_mentor.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/**
 * Hachage des refresh tokens avant persistance.
 *
 * <p>Le refresh token transmis au client n'est jamais stocké en clair : la base ne
 * contient que son empreinte SHA-256. Une fuite de la table ne permet donc pas de
 * rejouer les sessions.</p>
 */
public final class TokenHasher {

    private TokenHasher() {
    }

    public static String hash(String rawToken) {
        if (rawToken == null) {
            throw new IllegalArgumentException("Le token à hacher ne peut pas être null");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 est garanti par la JVM : ne peut pas arriver.
            throw new IllegalStateException("SHA-256 indisponible", e);
        }
    }
}
