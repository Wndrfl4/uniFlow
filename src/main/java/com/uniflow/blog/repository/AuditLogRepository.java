package com.uniflow.blog.repository;

import com.uniflow.blog.domain.AuditLog;
import com.uniflow.blog.domain.enums.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<AuditLog> findAllByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<AuditLog> findAllByActionOrderByCreatedAtDesc(AuditAction action, Pageable pageable);
}
