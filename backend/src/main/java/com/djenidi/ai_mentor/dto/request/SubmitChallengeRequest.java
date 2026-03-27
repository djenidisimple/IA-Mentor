package com.djenidi.ai_mentor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
public class SubmitChallengeRequest {

    @NotNull(message = "L'ID du challenge est obligatoire")
    private Long challengeId;

    @NotBlank(message = "L'URL GitHub est obligatoire")
    @URL(message = "L'URL doit être une URL valide")
    private String githubUrl;
}
