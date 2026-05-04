package com.uniflow.blog.kafka.consumer;

import com.uniflow.blog.domain.AiRequestHistory;
import com.uniflow.blog.domain.User;
import com.uniflow.blog.kafka.event.AiRequestEvent;
import com.uniflow.blog.repository.AiRequestHistoryRepository;
import com.uniflow.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiRequestConsumer {

    private final AiRequestHistoryRepository aiRequestHistoryRepository;
    private final UserRepository userRepository;

    @KafkaListener(topics = "uniflow.ai.requests", groupId = "uniflow-group")
    public void consume(AiRequestEvent event) {
        try {
            User user = userRepository.findById(event.getUserId()).orElse(null);
            if (user == null) {
                log.warn("User not found for AI request event: userId={}", event.getUserId());
                return;
            }

            AiRequestHistory history = AiRequestHistory.builder()
                    .user(user)
                    .prompt(event.getPrompt())
                    .response(event.getResponse())
                    .cached(event.isCached())
                    .build();

            aiRequestHistoryRepository.save(history);
            log.debug("Saved AI request history for userId={}", event.getUserId());
        } catch (Exception e) {
            log.error("Error processing AI request event for userId={}: {}", event.getUserId(), e.getMessage());
        }
    }
}
