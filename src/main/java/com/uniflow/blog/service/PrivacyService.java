package com.uniflow.blog.service;

import com.uniflow.blog.domain.DeletionRequest;
import com.uniflow.blog.domain.User;
import com.uniflow.blog.domain.enums.AuditAction;
import com.uniflow.blog.domain.enums.DeletionStatus;
import com.uniflow.blog.dto.ai.AiRequestHistoryDto;
import com.uniflow.blog.dto.post.PostDto;
import com.uniflow.blog.dto.privacy.DataExportDto;
import com.uniflow.blog.dto.privacy.DeletionRequestDto;
import com.uniflow.blog.exception.ApiException;
import com.uniflow.blog.exception.ResourceNotFoundException;
import com.uniflow.blog.kafka.event.DeletionRequestEvent;
import com.uniflow.blog.kafka.producer.DeletionRequestProducer;
import com.uniflow.blog.mapper.AiRequestHistoryMapper;
import com.uniflow.blog.mapper.PostMapper;
import com.uniflow.blog.mapper.UserMapper;
import com.uniflow.blog.repository.AiRequestHistoryRepository;
import com.uniflow.blog.repository.DeletionRequestRepository;
import com.uniflow.blog.repository.PostRepository;
import com.uniflow.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrivacyService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final AiRequestHistoryRepository aiRequestHistoryRepository;
    private final DeletionRequestRepository deletionRequestRepository;
    private final DeletionRequestProducer deletionRequestProducer;
    private final AuditService auditService;
    private final UserMapper userMapper;
    private final PostMapper postMapper;
    private final AiRequestHistoryMapper aiRequestHistoryMapper;

    @Transactional(readOnly = true)
    public DataExportDto exportData(String email) {
        User user = findUserByEmail(email);

        List<PostDto> posts = postRepository
                .findAllByAuthorId(user.getId(), Pageable.unpaged())
                .map(postMapper::toDto)
                .toList();

        List<AiRequestHistoryDto> aiHistory = aiRequestHistoryRepository
                .findAllByUserIdOrderByCreatedAtDesc(user.getId(), Pageable.unpaged())
                .map(aiRequestHistoryMapper::toDto)
                .toList();

        auditService.log(user.getId(), AuditAction.DATA_EXPORT_REQUESTED, "User requested data export");
        log.info("Data export for userId={}", user.getId());

        return DataExportDto.builder()
                .profile(userMapper.toDto(user))
                .posts(posts)
                .aiHistory(aiHistory)
                .exportedAt(LocalDateTime.now())
                .build();
    }

    @Transactional
    public DeletionRequestDto requestDeletion(String email) {
        User user = findUserByEmail(email);

        if (deletionRequestRepository.existsByUserIdAndStatus(user.getId(), DeletionStatus.PENDING)) {
            throw new ApiException(HttpStatus.CONFLICT, "A deletion request is already pending");
        }

        DeletionRequest request = DeletionRequest.builder()
                .user(user)
                .status(DeletionStatus.PENDING)
                .build();

        deletionRequestRepository.save(request);

        deletionRequestProducer.send(DeletionRequestEvent.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .requestedAt(LocalDateTime.now())
                .build());

        auditService.log(user.getId(), AuditAction.DATA_DELETE_REQUESTED, "User submitted deletion request");
        log.info("Deletion request created for userId={}", user.getId());

        return mapToDto(request);
    }

    @Transactional(readOnly = true)
    public DeletionRequestDto getDeletionStatus(String email) {
        User user = findUserByEmail(email);

        DeletionRequest request = deletionRequestRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No deletion request found"));

        return mapToDto(request);
    }

    @Transactional
    public void anonymize(String email) {
        User user = findUserByEmail(email);
        performAnonymization(user);
        auditService.log(user.getId(), AuditAction.PROFILE_ANONYMIZED, "User anonymized their profile");
    }

    @Transactional
    public void forceAnonymize(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        performAnonymization(user);
        auditService.log(userId, AuditAction.PROFILE_ANONYMIZED, "Admin forced profile anonymization");
    }

    private void performAnonymization(User user) {
        if (user.isAnonymized()) {
            throw new ApiException(HttpStatus.CONFLICT, "Profile is already anonymized");
        }
        user.setFirstName("Anonymous");
        user.setLastName("User");
        user.setEmail("anon_" + user.getId() + "@deleted.uniflow");
        user.setAnonymized(true);
        user.setEnabled(false);
        userRepository.save(user);
        log.info("Profile anonymized for userId={}", user.getId());
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    @Transactional(readOnly = true)
    public List<DeletionRequestDto> getAllPendingRequests() {
        return deletionRequestRepository.findAll().stream()
                .filter(r -> r.getStatus() == DeletionStatus.PENDING)
                .map(this::mapToDto)
                .toList();
    }

    @Transactional
    public void approveDeletion(Long requestId) {
        DeletionRequest request = deletionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Deletion request not found"));

        performAnonymization(request.getUser());

        request.setStatus(DeletionStatus.COMPLETED);
        request.setProcessedAt(LocalDateTime.now());
        deletionRequestRepository.save(request);

        auditService.log(request.getUser().getId(), AuditAction.PROFILE_ANONYMIZED,
                "Admin approved deletion request #" + requestId);
        log.info("Deletion request #{} approved", requestId);
    }

    private DeletionRequestDto mapToDto(DeletionRequest request) {
        DeletionRequestDto dto = new DeletionRequestDto();
        dto.setId(request.getId());
        dto.setUserId(request.getUser().getId());
        dto.setUserEmail(request.getUser().getEmail());
        dto.setUserFirstName(request.getUser().getFirstName());
        dto.setUserLastName(request.getUser().getLastName());
        dto.setStatus(request.getStatus());
        dto.setRequestedAt(request.getRequestedAt());
        dto.setProcessedAt(request.getProcessedAt());
        return dto;
    }
}
