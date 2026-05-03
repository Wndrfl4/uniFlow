package com.uniflow.blog.dto.post;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectPostRequest {

    @NotBlank(message = "Rejection reason must not be blank")
    private String reason;
}
