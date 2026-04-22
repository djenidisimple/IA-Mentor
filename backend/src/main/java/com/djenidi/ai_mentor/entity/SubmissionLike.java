package com.djenidi.ai_mentor.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entité gérant les "Likes" sur les soumissions de code.
 * La contrainte d'unicité garantit qu'un utilisateur ne peut liker qu'une seule fois 
 * une soumission spécifique.
 */
@Entity
@Table(name = "submission_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "submission_id"})
})
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SubmissionLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    // L'utilisateur qui a donné le like
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // La soumission (et donc l'analyse IA) qui reçoit le like
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;

    // Date automatique de création du like
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
