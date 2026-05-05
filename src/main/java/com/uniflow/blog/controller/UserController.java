package com.uniflow.blog.controller;

import com.uniflow.blog.domain.User;
import com.uniflow.blog.dto.user.UserDto;
import com.uniflow.blog.exception.ApiException;
import com.uniflow.blog.mapper.UserMapper;
import com.uniflow.blog.repository.UserRepository;
import com.uniflow.blog.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final FileStorageService fileStorageService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        User user = findUser(userDetails.getUsername());
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @PostMapping("/me/avatar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only image files are allowed for avatars");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Avatar must be under 5 MB");
        }

        User user = findUser(userDetails.getUsername());
        String url = fileStorageService.store(file);
        user.setAvatarUrl(url);
        userRepository.save(user);

        return ResponseEntity.ok(userMapper.toDto(user));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
