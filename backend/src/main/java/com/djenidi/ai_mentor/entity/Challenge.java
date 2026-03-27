package com.djenidi.ai_mentor.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "challenges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeLevel level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeType type;

    @Builder.Default
    @ElementCollection
    @CollectionTable(
        name = "challenge_technologies",
        joinColumns = @JoinColumn(name = "challenge_id")
    )
    @Column(name = "technology")
    private List<String> technologies = new ArrayList<>();

    @Builder.Default
    @ElementCollection
    @CollectionTable(
        name = "challenge_criteres_ia",
        joinColumns = @JoinColumn(name = "challenge_id")
    )
    @Column(name = "critere", columnDefinition = "TEXT")
    private List<String> criteresIA = new ArrayList<>();

    @Column(nullable = false)
    private Integer points;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isPremium = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
