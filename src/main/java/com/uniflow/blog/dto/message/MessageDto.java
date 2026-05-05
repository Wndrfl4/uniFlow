package com.uniflow.blog.dto.message;

import com.uniflow.blog.domain.enums.MessageType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String content;
    private MessageType type;
    private String fileUrl;
    private boolean read;
    private LocalDateTime createdAt;
}
