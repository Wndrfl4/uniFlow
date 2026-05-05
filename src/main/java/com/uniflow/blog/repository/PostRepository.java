package com.uniflow.blog.repository;

import com.uniflow.blog.domain.Post;
import com.uniflow.blog.domain.enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findAllByStatus(PostStatus status, Pageable pageable);

    Page<Post> findAllByAuthorId(Long authorId, Pageable pageable);

    Page<Post> findAllByAuthorIdAndStatus(Long authorId, PostStatus status, Pageable pageable);

    @Query("""
            SELECT DISTINCT p FROM Post p
            WHERE p.status = :status
              AND (CAST(:q AS string) IS NULL
                   OR LOWER(p.title) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%'))
                   OR LOWER(p.content) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')))
              AND (CAST(:tag AS string) IS NULL OR CAST(:tag AS string) MEMBER OF p.tags)
            """)
    Page<Post> search(@Param("status") PostStatus status,
                      @Param("q") String q,
                      @Param("tag") String tag,
                      Pageable pageable);

    long countByStatus(PostStatus status);
}
