package com.uniflow.blog.dto.message;

import com.uniflow.blog.domain.enums.MessageType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotNull
    private Long receiverId;

    private String content;

    @NotNull
    private MessageType type;

    private String fileUrl;
}
