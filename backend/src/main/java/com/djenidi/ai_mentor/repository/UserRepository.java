package com.djenidi.ai_mentor.repository;

import com.djenidi.ai_mentor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findTop5ByOrderByPointsDesc();

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.following ORDER BY u.points DESC")
    List<User> findAllByOrderByPointsDesc();

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByGithubId(String githubId);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
