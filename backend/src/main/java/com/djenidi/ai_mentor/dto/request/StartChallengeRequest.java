package com.djenidi.ai_mentor.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StartChallengeRequest {

    @NotNull(message = "L'ID du challenge est obligatoire")
    private Long challengeId;
}
