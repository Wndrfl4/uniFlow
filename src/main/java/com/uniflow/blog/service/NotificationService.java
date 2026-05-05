package com.uniflow.blog.service;

import com.uniflow.blog.domain.Notification;
import com.uniflow.blog.dto.notification.NotificationDto;
import com.uniflow.blog.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void notify(Long userId, String type, String message, String link) {
        Notification n = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .link(link)
                .build();
        notificationRepository.save(n);
        messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/queue/notifications", toDto(n));
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getAll(Long userId) {
        return notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    private NotificationDto toDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setType(n.getType());
        dto.setMessage(n.getMessage());
        dto.setLink(n.getLink());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
