package com.uniflow.blog.dto.notification;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDto {
    private Long id;
    private String type;
    private String message;
    private String link;
    private boolean read;
    private LocalDateTime createdAt;
}
