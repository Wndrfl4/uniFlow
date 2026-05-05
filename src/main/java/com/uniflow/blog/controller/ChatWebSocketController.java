package com.uniflow.blog.controller;

import com.uniflow.blog.domain.User;
import com.uniflow.blog.dto.message.CallSignalDto;
import com.uniflow.blog.dto.message.MessageDto;
import com.uniflow.blog.dto.message.SendMessageRequest;
import com.uniflow.blog.exception.ApiException;
import com.uniflow.blog.repository.UserRepository;
import com.uniflow.blog.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final MessageService messageService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messaging;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, Principal principal) {
        MessageDto saved = messageService.saveMessage(principal.getName(), request);

        User receiver = userRepository.findById(saved.getReceiverId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Receiver not found"));

        messaging.convertAndSendToUser(receiver.getEmail(), "/queue/messages", saved);
        messaging.convertAndSendToUser(principal.getName(), "/queue/messages", saved);
    }

    @MessageMapping("/call.signal")
    public void handleCallSignal(@Payload CallSignalDto signal, Principal principal) {
        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        User target = userRepository.findById(signal.getTargetUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Target not found"));

        signal.setFromUserId(sender.getId());
        signal.setFromUserName(sender.getFirstName() + " " + sender.getLastName());

        messaging.convertAndSendToUser(target.getEmail(), "/queue/call", signal);
    }
}
