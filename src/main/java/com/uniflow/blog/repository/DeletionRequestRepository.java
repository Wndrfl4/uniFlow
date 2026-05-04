package com.uniflow.blog.repository;

import com.uniflow.blog.domain.DeletionRequest;
import com.uniflow.blog.domain.enums.DeletionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeletionRequestRepository extends JpaRepository<DeletionRequest, Long> {

    Optional<DeletionRequest> findByUserId(Long userId);

    boolean existsByUserIdAndStatus(Long userId, DeletionStatus status);
}
