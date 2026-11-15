package com.djenidi.ai_mentor.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Code à usage unique reçu à la fin du flux OAuth2. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2ExchangeRequest {

    @NotBlank(message = "Le code OAuth2 est obligatoire")
    private String code;
}
