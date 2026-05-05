package com.uniflow.blog.util.ai;

import com.uniflow.blog.config.AiProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
public class OpenRouterAiClient implements AiClient {

    private final WebClient webClient;
    private final String model;

    public OpenRouterAiClient(AiProperties.Openrouter props) {
        this.model = props.getModel();
        this.webClient = WebClient.builder()
                .baseUrl(props.getBaseUrl())
                .defaultHeader("Authorization", "Bearer " + props.getApiKey())
                .defaultHeader("Content-Type", "application/json")
                .defaultHeader("HTTP-Referer", props.getSiteUrl())
                .defaultHeader("X-Title", props.getSiteName())
                .build();
    }

    @Override
    public String call(String prompt) {
        log.debug("Calling OpenRouter API with model={}", model);

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "max_tokens", 1024,
                "temperature", 0.7
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> response = webClient.post()
                .uri("/api/v1/chat/completions")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractText(response);
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> response) {
        if (response == null) throw new IllegalStateException("Empty response from OpenRouter");
        var choices = (List<Map<String, Object>>) response.get("choices");
        if (choices == null || choices.isEmpty()) throw new IllegalStateException("No choices in OpenRouter response");
        var message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }

    @Override
    public String getProviderName() {
        return "OpenRouter (" + model + ")";
    }
}
