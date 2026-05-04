package com.uniflow.blog.dto.privacy;

import com.uniflow.blog.domain.enums.DeletionStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeletionRequestDto {

    private Long id;
    private Long userId;
    private DeletionStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
}
