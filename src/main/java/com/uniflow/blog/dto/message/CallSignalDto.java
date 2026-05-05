package com.uniflow.blog.dto.message;

import lombok.Data;

@Data
public class CallSignalDto {
    private Long fromUserId;
    private String fromUserName;
    private Long targetUserId;
    private String type;   // OFFER | ANSWER | ICE_CANDIDATE | CALL_END
    private String payload;
    private Boolean audioOnly;
}
