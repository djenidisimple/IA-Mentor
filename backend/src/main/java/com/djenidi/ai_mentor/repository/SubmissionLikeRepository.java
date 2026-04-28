package com.djenidi.ai_mentor.repository;
import com.djenidi.ai_mentor.entity.SubmissionLike;
import com.djenidi.ai_mentor.entity.User;
import com.djenidi.ai_mentor.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SubmissionLikeRepository extends JpaRepository<SubmissionLike, Long> {
    Optional<SubmissionLike> findByUserAndSubmission(User user, Submission submission);
    boolean existsByUserAndSubmission(User user, Submission submission);
    @Query("SELECT s FROM Submission s LEFT JOIN FETCH s.user LEFT JOIN FETCH s.challenge WHERE s.status = 'COMPLETED' ORDER BY s.submittedAt DESC")
    List<Submission> findAllForFeed();
    List<SubmissionLike> findAllByUser(User user);
    @Query("SELECT COUNT(sl) FROM SubmissionLike sl WHERE sl.submission.id = :submissionId")
    Long getLikeCountBySubmissionId(@Param("submissionId") Long submissionId);
}
