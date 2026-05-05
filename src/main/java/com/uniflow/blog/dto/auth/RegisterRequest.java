package com.uniflow.blog.dto.auth;

import com.uniflow.blog.domain.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Email(message = "Invalid email format")
    @Size(max = 255)
    private String email;

    @NotBlank
    @Size(min = 8, max = 72, message = "Password must be between 8 and 72 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_#^])[A-Za-z\\d@$!%*?&_#^]{8,}$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character (@$!%*?&_#^)"
    )
    private String password;

    @NotBlank
    @Size(min = 1, max = 100, message = "First name must be between 1 and 100 characters")
    @Pattern(regexp = "^[\\p{L}\\s'-]+$", message = "First name contains invalid characters")
    private String firstName;

    @NotBlank
    @Size(min = 1, max = 100, message = "Last name must be between 1 and 100 characters")
    @Pattern(regexp = "^[\\p{L}\\s'-]+$", message = "Last name contains invalid characters")
    private String lastName;

    @NotNull
    private Role role;
}
