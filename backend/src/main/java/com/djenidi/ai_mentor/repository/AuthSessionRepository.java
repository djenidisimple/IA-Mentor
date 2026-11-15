package com.djenidi.ai_mentor.repository;

import com.djenidi.ai_mentor.entity.AuthSession;
import com.djenidi.ai_mentor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuthSessionRepository extends JpaRepository<AuthSession, Long> {

    Optional<AuthSession> findByTokenHash(String tokenHash);

    Optional<AuthSession> findByPreviousTokenHash(String previousTokenHash);

    List<AuthSession> findByUserAndRevokedFalseOrderByCreatedAtAsc(User user);

    // Révoque toutes les sessions actives d'un utilisateur (détection de rejeu).
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE AuthSession s SET s.revoked = true WHERE s.user = :user AND s.revoked = false")
    int revokeAllByUser(@Param("user") User user);

    // Nettoyage planifié : sessions expirées ou révoquées.
    @Modifying
    @Query("DELETE FROM AuthSession s WHERE s.expiryDate < :now OR s.revoked = true")
    int deleteExpiredAndRevoked(@Param("now") Instant now);
}
