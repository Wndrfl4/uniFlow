package com.uniflow.blog.service;

import com.uniflow.blog.domain.AuditLog;
import com.uniflow.blog.domain.enums.AuditAction;
import com.uniflow.blog.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(Long userId, AuditAction action, String details) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .action(action)
                    .details(details)
                    .build();
            auditLogRepository.save(auditLog);
            log.debug("Audit logged: userId={}, action={}", userId, action);
        } catch (Exception e) {
            log.error("Failed to save audit log: userId={}, action={}: {}", userId, action, e.getMessage());
        }
    }
}
