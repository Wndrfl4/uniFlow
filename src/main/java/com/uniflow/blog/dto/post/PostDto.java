package com.uniflow.blog.dto.post;

import com.uniflow.blog.domain.enums.PostStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class PostDto {

    private Long id;
    private String title;
    private String content;
    private PostStatus status;
    private String rejectionReason;
    private Long authorId;
    private String authorName;
    private String authorAvatarUrl;
    private Set<String> tags;
    private int likeCount;
    private boolean likedByCurrentUser;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
