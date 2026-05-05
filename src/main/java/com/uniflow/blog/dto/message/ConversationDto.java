package com.uniflow.blog.dto.message;

import com.uniflow.blog.domain.enums.MessageType;
import com.uniflow.blog.domain.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ConversationDto {
    private Long userId;
    private String firstName;
    private String lastName;
    private Role role;
    private String lastMessage;
    private MessageType lastMessageType;
    private LocalDateTime lastMessageAt;
    private long unreadCount;
}
