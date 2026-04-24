package com.djenidi.ai_mentor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
    @NotBlank(message = "Le contenu ne peut pas être vide")
    @Size(max = 1000, message = "Le commentaire est trop long (max 1000 caractères)")
    String content
) {}