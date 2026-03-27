package com.djenidi.ai_mentor.dto.request;

import com.djenidi.ai_mentor.entity.ChallengeLevel;
import com.djenidi.ai_mentor.entity.ChallengeType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateChallengeRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "Le niveau est obligatoire")
    private ChallengeLevel level;

    @NotNull(message = "Le type est obligatoire")
    private ChallengeType type;

    @NotNull(message = "La catégorie est obligatoire")
    private Long categoryId;

    private List<String> technologies;

    private List<String> criteresIA;

    @NotNull(message = "Les points sont obligatoires")
    @Min(value = 1, message = "Les points doivent être supérieurs à 0")
    private Integer points;

    private Boolean isPremium = false;
}
