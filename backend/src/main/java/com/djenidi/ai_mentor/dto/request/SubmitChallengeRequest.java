package com.djenidi.ai_mentor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubmitChallengeRequest {

    @NotNull(message = "L'ID du challenge est obligatoire")
    private Long challengeId;

    @NotBlank(message = "L'URL GitHub est obligatoire")
    @Pattern(
            regexp = "^https://github[.]com/[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?/[A-Za-z0-9._-]+([.]git)?/?$",
            message = "Use HTTPS repository URL, format https://github.com/votre-login/depot")
    private String githubUrl;

    @Size(max = 1000, message = "Le commentaire ne peut pas depasser 1000 caracteres")
    private String comment;
}
