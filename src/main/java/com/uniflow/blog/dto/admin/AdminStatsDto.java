package com.uniflow.blog.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDto {
    private long totalUsers;
    private long totalPosts;
    private long publishedPosts;
    private long pendingPosts;
    private long totalComments;
    private long totalAiRequests;
}
