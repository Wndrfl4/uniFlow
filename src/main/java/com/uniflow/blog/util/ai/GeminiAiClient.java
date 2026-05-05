package com.uniflow.blog.util.ai;

import com.uniflow.blog.config.AiProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
public class GeminiAiClient implements AiClient {

    private final WebClient webClient;
    private final String model;
    private final String apiKey;

    public GeminiAiClient(AiProperties.Gemini props) {
        this.model = props.getModel();
        this.apiKey = props.getApiKey();
        this.webClient = WebClient.builder()
                .baseUrl(props.getBaseUrl())
                .build();
    }

    @Override
    public String call(String prompt) {
        log.debug("Calling Gemini API with model={}", model);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of("temperature", 0.7, "maxOutputTokens", 1024)
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> response = webClient.post()
                .uri("/v1beta/models/{model}:generateContent?key={key}", model, apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractGeminiText(response);
    }

    @SuppressWarnings("unchecked")
    private String extractGeminiText(Map<String, Object> response) {
        if (response == null) throw new IllegalStateException("Empty response from Gemini");
        var candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) throw new IllegalStateException("No candidates in Gemini response");
        var content = (Map<String, Object>) candidates.get(0).get("content");
        var parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) throw new IllegalStateException("No parts in Gemini response");
        return (String) parts.get(0).get("text");
    }

    @Override
    public String getProviderName() {
        return "Gemini (" + model + ")";
    }
}
