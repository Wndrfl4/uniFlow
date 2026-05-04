package com.uniflow.blog.dto.privacy;

import com.uniflow.blog.dto.ai.AiRequestHistoryDto;
import com.uniflow.blog.dto.post.PostDto;
import com.uniflow.blog.dto.user.UserDto;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class DataExportDto {

    private UserDto profile;
    private List<PostDto> posts;
    private List<AiRequestHistoryDto> aiHistory;
    private LocalDateTime exportedAt;
}
