package com.uniflow.blog.dto.admin;

import com.uniflow.blog.domain.enums.AuditAction;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuditLogDto {

    private Long id;
    private Long userId;
    private AuditAction action;
    private String details;
    private LocalDateTime createdAt;
}
