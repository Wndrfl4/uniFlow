package com.uniflow.blog.service;

import com.uniflow.blog.domain.Message;
import com.uniflow.blog.domain.User;
import com.uniflow.blog.dto.message.ConversationDto;
import com.uniflow.blog.dto.message.MessageDto;
import com.uniflow.blog.dto.message.SendMessageRequest;
import com.uniflow.blog.exception.ApiException;
import com.uniflow.blog.repository.MessageRepository;
import com.uniflow.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageDto saveMessage(String senderEmail, SendMessageRequest request) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .type(request.getType())
                .fileUrl(request.getFileUrl())
                .build();

        return toDto(messageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getConversation(String currentEmail, Long otherUserId) {
        User current = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        return messageRepository.findConversation(current.getId(), otherUserId)
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> getConversations(String currentEmail) {
        User current = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        List<Long> contactIds = messageRepository.findContactIds(current.getId());

        return contactIds.stream().map(contactId -> {
            User contact = userRepository.findById(contactId).orElseThrow();
            Message last = messageRepository.findLastMessage(current.getId(), contactId).orElseThrow();
            long unread = messageRepository.countUnread(current.getId(), contactId);

            String preview = switch (last.getType()) {
                case IMAGE -> "📷 Изображение";
                case VIDEO -> "🎥 Видео";
                case VOICE -> "🎤 Голосовое";
                case GIF -> "GIF";
                case STICKER -> last.getContent() != null ? last.getContent() : "Стикер";
                default -> last.getContent();
            };

            return ConversationDto.builder()
                    .userId(contactId)
                    .firstName(contact.getFirstName())
                    .lastName(contact.getLastName())
                    .role(contact.getRole())
                    .lastMessage(preview)
                    .lastMessageType(last.getType())
                    .lastMessageAt(last.getCreatedAt())
                    .unreadCount(unread)
                    .build();
        }).toList();
    }

    @Transactional
    public void markAsRead(String currentEmail, Long senderId) {
        User current = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        messageRepository.markAsRead(current.getId(), senderId);
    }

    @Transactional(readOnly = true)
    public List<User> searchUsers(String currentEmail, String query) {
        return userRepository.findAll().stream()
                .filter(u -> !u.getEmail().equals(currentEmail) && !u.isAnonymized())
                .filter(u -> {
                    String q = query.toLowerCase();
                    return u.getFirstName().toLowerCase().contains(q)
                            || u.getLastName().toLowerCase().contains(q)
                            || u.getEmail().toLowerCase().contains(q);
                })
                .limit(20)
                .toList();
    }

    private MessageDto toDto(Message m) {
        return MessageDto.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .senderName(m.getSender().getFirstName() + " " + m.getSender().getLastName())
                .receiverId(m.getReceiver().getId())
                .content(m.getContent())
                .type(m.getType())
                .fileUrl(m.getFileUrl())
                .read(m.isRead())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
