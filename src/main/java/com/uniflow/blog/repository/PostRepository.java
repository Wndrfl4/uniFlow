package com.uniflow.blog.repository;

import com.uniflow.blog.domain.Post;
import com.uniflow.blog.domain.enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findAllByStatus(PostStatus status, Pageable pageable);

    Page<Post> findAllByAuthorId(Long authorId, Pageable pageable);

    Page<Post> findAllByAuthorIdAndStatus(Long authorId, PostStatus status, Pageable pageable);
}
