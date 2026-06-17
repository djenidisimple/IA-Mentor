package com.djenidi.ai_mentor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

@Getter
@Setter
public class SubmitChallengeRequest {

    @NotNull(message = "L'ID du challenge est obligatoire")
    private Long challengeId;

    @NotBlank(message = "L'URL GitHub est obligatoire")
    @URL(message = "L'URL doit être une URL valide (https://github.com/...)")
    @Pattern(regexp = "^https?://github\\.com/[a-zA-Z0-9._-]+/[a-zA-Z0-9._-]+.*$",
             message = "L'URL doit être un lien GitHub valide (https://github.com/username/repository)")
    private String githubUrl;
}
