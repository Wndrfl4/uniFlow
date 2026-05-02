package com.uniflow.blog.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic aiRequestsTopic() {
        return TopicBuilder.name("uniflow.ai.requests")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic deletionRequestsTopic() {
        return TopicBuilder.name("uniflow.deletion.requests")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic auditEventsTopic() {
        return TopicBuilder.name("uniflow.audit.events")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
