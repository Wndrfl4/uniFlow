package com.uniflow.blog.repository;

import com.uniflow.blog.domain.AiRequestHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiRequestHistoryRepository extends JpaRepository<AiRequestHistory, Long> {

    Page<AiRequestHistory> findAllByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
