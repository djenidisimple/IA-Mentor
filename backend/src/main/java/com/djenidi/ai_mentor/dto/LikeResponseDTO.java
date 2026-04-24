package com.djenidi.ai_mentor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LikeResponseDTO {
    private boolean liked;
    private Long likesCount;
}
