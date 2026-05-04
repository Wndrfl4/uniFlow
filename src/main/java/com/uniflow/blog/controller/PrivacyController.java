package com.uniflow.blog.controller;

import com.uniflow.blog.dto.privacy.DataExportDto;
import com.uniflow.blog.dto.privacy.DeletionRequestDto;
import com.uniflow.blog.service.PrivacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/privacy")
@RequiredArgsConstructor
public class PrivacyController {

    private final PrivacyService privacyService;

    @GetMapping("/export")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DataExportDto> exportData(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(privacyService.exportData(userDetails.getUsername()));
    }

    @PostMapping("/deletion-request")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeletionRequestDto> requestDeletion(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(privacyService.requestDeletion(userDetails.getUsername()));
    }

    @GetMapping("/deletion-request/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeletionRequestDto> getDeletionStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(privacyService.getDeletionStatus(userDetails.getUsername()));
    }

    @PostMapping("/anonymize")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> anonymize(
            @AuthenticationPrincipal UserDetails userDetails) {
        privacyService.anonymize(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
