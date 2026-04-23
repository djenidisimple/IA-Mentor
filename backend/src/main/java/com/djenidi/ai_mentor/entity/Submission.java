package com.djenidi.ai_mentor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "submissions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "challenge_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    // === RELATIONS ===

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubmissionLike> likes = new ArrayList<>();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    public int getLikeCount() {
        return likes != null ? likes.size() : 0;
    }

    public int getCommentCount() {
        return comments != null ? comments.size() : 0;
    }

    // === DONNÉES ===

    private String githubUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SubmissionStatus status = SubmissionStatus.IN_PROGRESS;

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    private Integer score;

    // === TIMESTAMPS ===

    @Column(nullable = false, updatable = false)
    private LocalDateTime startedAt;

    private LocalDateTime submittedAt;

    private LocalDateTime reviewedAt;

    // === LIFECYCLE ===

    @PrePersist
    protected void onCreate() {
        startedAt = LocalDateTime.now();
    }
}
