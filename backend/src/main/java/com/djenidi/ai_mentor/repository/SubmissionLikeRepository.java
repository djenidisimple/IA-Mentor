package com.djenidi.ai_mentor.repository;
import com.djenidi.ai_mentor.entity.SubmissionLike;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SubmissionLikeRepository extends JpaRepository<SubmissionLike, Long> {
    Optional<SubmissionLike> findByUserAndSubmission(User user, Submission submission);
    boolean existsByUserAndSubmission(User user, Submission submission);
}
