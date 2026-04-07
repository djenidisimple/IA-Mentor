package com.djenidi.ai_mentor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "challenges")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeLevel level;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChallengeType type;

    // === RELATIONS ===

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Submission> submissions = new ArrayList<>();

    // === DONNÉES ===

    @Builder.Default
    @ElementCollection
    @CollectionTable(
        name = "challenge_technologies",
        joinColumns = @JoinColumn(name = "challenge_id")
    )
    @Column(name = "technology")
    private Set<String> technologies = new LinkedHashSet<>();

    @Builder.Default
    @ElementCollection
    @CollectionTable(
        name = "challenge_criteres_ia",
        joinColumns = @JoinColumn(name = "challenge_id")
    )
    @Column(name = "critere", columnDefinition = "TEXT")
    private Set<String> criteresIA = new LinkedHashSet<>();

    @Column(nullable = false)
    private Integer points;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isPremium = false;

    // === LIFECYCLE ===

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
