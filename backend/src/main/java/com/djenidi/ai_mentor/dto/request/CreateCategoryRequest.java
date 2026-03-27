package com.djenidi.ai_mentor.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCategoryRequest {

    @NotBlank(message = "Le nom de la catégorie est obligatoire")
    private String name;

    @NotBlank(message = "La description est obligatoire")
    private String description;
}
