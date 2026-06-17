package com.djenidi.ai_mentor.dto.request;

import com.djenidi.ai_mentor.entity.ChallengeLevel;
import com.djenidi.ai_mentor.entity.ChallengeType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class CreateChallengeRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 3, max = 200, message = "Le titre doit faire entre 3 et 200 caractères")
    private String title;

    @NotBlank(message = "La description est obligatoire")
    @Size(min = 10, max = 2000, message = "La description doit faire entre 10 et 2000 caractères")
    private String description;

    @NotNull(message = "Le niveau est obligatoire")
    private ChallengeLevel level;

    @NotNull(message = "Le type est obligatoire")
    private ChallengeType type;

    @NotNull(message = "La catégorie est obligatoire")
    private Long categoryId;

    @Size(max = 20, message = "Maximum 20 technologies")
    private Set<@NotBlank(message = "Une technologie ne peut pas être vide") String> technologies;

    @Size(max = 10, message = "Maximum 10 critères IA")
    private Set<@NotBlank(message = "Un critère IA ne peut pas être vide") String> criteresIA;

    @NotNull(message = "Les points sont obligatoires")
    @Min(value = 1, message = "Les points doivent être supérieurs à 0")
    @Max(value = 10000, message = "Les points ne peuvent pas dépasser 10000")
    private Integer points;

    private Boolean isPremium = false;
}
