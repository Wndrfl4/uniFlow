package com.uniflow.blog.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiRequestEvent {

    private Long userId;
    private String prompt;
    private String response;
    private boolean cached;
    private LocalDateTime occurredAt;
}
