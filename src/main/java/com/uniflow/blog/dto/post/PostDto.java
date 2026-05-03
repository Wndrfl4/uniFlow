package com.uniflow.blog.dto.post;

import com.uniflow.blog.domain.enums.PostStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostDto {

    private Long id;
    private String title;
    private String content;
    private PostStatus status;
    private String rejectionReason;
    private Long authorId;
    private String authorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
