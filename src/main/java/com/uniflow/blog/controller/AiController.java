package com.uniflow.blog.controller;

import com.uniflow.blog.dto.ai.AiRequest;
import com.uniflow.blog.dto.ai.AiRequestHistoryDto;
import com.uniflow.blog.dto.ai.AiResponse;
import com.uniflow.blog.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/ask")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<AiResponse> ask(
            @Valid @RequestBody AiRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiService.ask(request, userDetails.getUsername()));
    }

    @GetMapping("/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<AiRequestHistoryDto>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(aiService.getHistory(userDetails.getUsername(), pageable));
    }

    @GetMapping("/remaining")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Long>> getRemainingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        long remaining = aiService.getRemainingRequests(userDetails.getUsername());
        return ResponseEntity.ok(Map.of("remaining", remaining));
    }
}
