package com.uniflow.blog.kafka.producer;

import com.uniflow.blog.kafka.event.DeletionRequestEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeletionRequestProducer {

    private static final String TOPIC = "uniflow.deletion.requests";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void send(DeletionRequestEvent event) {
        kafkaTemplate.send(TOPIC, String.valueOf(event.getUserId()), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send deletion request event for userId={}: {}", event.getUserId(), ex.getMessage());
                    } else {
                        log.info("Deletion request event sent for userId={}", event.getUserId());
                    }
                });
    }
}
