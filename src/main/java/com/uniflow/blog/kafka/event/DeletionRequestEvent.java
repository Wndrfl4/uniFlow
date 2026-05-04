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
public class DeletionRequestEvent {

    private Long userId;
    private String email;
    private LocalDateTime requestedAt;
}
