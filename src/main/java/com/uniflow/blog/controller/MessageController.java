package com.uniflow.blog.controller;

import com.uniflow.blog.dto.message.ConversationDto;
import com.uniflow.blog.dto.message.MessageDto;
import com.uniflow.blog.dto.user.UserDto;
import com.uniflow.blog.mapper.UserMapper;
import com.uniflow.blog.service.FileStorageService;
import com.uniflow.blog.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final FileStorageService fileStorageService;
    private final UserMapper userMapper;

    @GetMapping("/conversations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ConversationDto>> getConversations(Principal principal) {
        return ResponseEntity.ok(messageService.getConversations(principal.getName()));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageDto>> getConversation(
            @PathVariable Long userId,
            Principal principal) {
        return ResponseEntity.ok(messageService.getConversation(principal.getName(), userId));
    }

    @PutMapping("/{userId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(@PathVariable Long userId, Principal principal) {
        messageService.markAsRead(principal.getName(), userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource resource = fileStorageService.load(filename);
        String contentType = "application/octet-stream";
        try {
            contentType = resource.getURL().openConnection().getContentType();
        } catch (Exception ignored) {}
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @GetMapping("/users/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserDto>> searchUsers(
            @RequestParam(defaultValue = "") String q,
            Principal principal) {
        return ResponseEntity.ok(
                messageService.searchUsers(principal.getName(), q)
                        .stream().map(userMapper::toDto).toList()
        );
    }
}
