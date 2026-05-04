package com.uniflow.blog.dto.ai;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AiRequestHistoryDto {

    private Long id;
    private Long userId;
    private String prompt;
    private String response;
    private boolean cached;
    private LocalDateTime createdAt;
}
