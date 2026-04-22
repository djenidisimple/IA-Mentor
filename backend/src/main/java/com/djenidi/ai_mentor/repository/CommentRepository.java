package com.djenidi.ai_mentor.repository;
import com.djenidi.ai_mentor.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByChallengeIdOrderByCreatedAtDesc(Long challengeId);
}
