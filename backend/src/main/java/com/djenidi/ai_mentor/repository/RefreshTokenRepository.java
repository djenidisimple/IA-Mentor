package com.djenidi.ai_mentor.repository;

import com.djenidi.ai_mentor.entity.RefreshToken;
import com.djenidi.ai_mentor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(User user);

    // Supprime tous les tokens expirés (appelé par un @Scheduled)
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryDate < :now OR rt.revoked = true")
    void deleteExpiredAndRevoked(Instant now);
}