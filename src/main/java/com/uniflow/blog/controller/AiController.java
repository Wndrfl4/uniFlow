package com.uniflow.blog.controller;

import com.uniflow.blog.config.AiProperties;
import com.uniflow.blog.dto.ai.AiRequest;
import com.uniflow.blog.dto.ai.AiRequestHistoryDto;
import com.uniflow.blog.dto.ai.AiResponse;
import com.uniflow.blog.service.AiService;
import com.uniflow.blog.util.ai.AiClient;
import com.uniflow.blog.util.ai.AiProvider;
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

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;
    private final AiClient aiClient;
    private final AiProperties aiProperties;

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

    @GetMapping("/providers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getProviders() {
        List<Map<String, String>> available = Arrays.stream(AiProvider.values())
                .map(p -> Map.of("id", p.name().toLowerCase(), "label", providerLabel(p)))
                .toList();

        return ResponseEntity.ok(Map.of(
                "current", aiProperties.getProvider().name().toLowerCase(),
                "currentLabel", aiClient.getProviderName(),
                "available", available
        ));
    }

    private String providerLabel(AiProvider provider) {
        return switch (provider) {
            case MOCK -> "Mock (локальный)";
            case GEMINI -> "Google Gemini";
            case GROQ -> "Groq (Llama/Mixtral)";
            case OPENROUTER -> "OpenRouter (Free models)";
        };
    }
}
