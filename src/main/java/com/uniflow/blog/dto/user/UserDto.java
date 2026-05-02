package com.uniflow.blog.dto.user;

import com.uniflow.blog.domain.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private boolean enabled;
    private boolean anonymized;
    private LocalDateTime createdAt;
}
