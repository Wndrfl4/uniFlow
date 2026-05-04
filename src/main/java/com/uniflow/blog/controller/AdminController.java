package com.uniflow.blog.controller;

import com.uniflow.blog.domain.enums.AuditAction;
import com.uniflow.blog.dto.admin.AuditLogDto;
import com.uniflow.blog.dto.user.UserDto;
import com.uniflow.blog.exception.ResourceNotFoundException;
import com.uniflow.blog.mapper.UserMapper;
import com.uniflow.blog.repository.AuditLogRepository;
import com.uniflow.blog.repository.UserRepository;
import com.uniflow.blog.service.PrivacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PrivacyService privacyService;
    private final UserMapper userMapper;

    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(userRepository.findAll(pageable).map(userMapper::toDto));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @PostMapping("/users/{id}/anonymize")
    public ResponseEntity<Void> forceAnonymize(@PathVariable Long id) {
        privacyService.forceAnonymize(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/audit")
    public ResponseEntity<Page<AuditLogDto>> getAuditLogs(
            @RequestParam(required = false) AuditAction action,
            @RequestParam(required = false) Long userId,
            @PageableDefault(size = 50, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AuditLogDto> result;
        if (action != null) {
            result = auditLogRepository.findAllByActionOrderByCreatedAtDesc(action, pageable).map(this::mapAuditLog);
        } else if (userId != null) {
            result = auditLogRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable).map(this::mapAuditLog);
        } else {
            result = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::mapAuditLog);
        }
        return ResponseEntity.ok(result);
    }

    private AuditLogDto mapAuditLog(com.uniflow.blog.domain.AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setAction(log.getAction());
        dto.setDetails(log.getDetails());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }
}
