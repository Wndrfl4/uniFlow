package com.uniflow.blog.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AiRequest {

    @NotBlank
    @Size(min = 2, max = 2000, message = "Prompt must be between 2 and 2000 characters")
    private String prompt;
}
