package com.uniflow.blog.config;

import com.uniflow.blog.util.ai.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class AiClientConfig {

    private final AiProperties aiProperties;

    @Bean
    public AiClient aiClient() {
        AiProvider provider = aiProperties.getProvider();
        log.info("Initializing AI provider: {}", provider);
        return switch (provider) {
            case GEMINI -> {
                validateKey(aiProperties.getGemini().getApiKey(), "GEMINI_API_KEY");
                yield new GeminiAiClient(aiProperties.getGemini());
            }
            case GROQ -> {
                validateKey(aiProperties.getGroq().getApiKey(), "GROQ_API_KEY");
                yield new GroqAiClient(aiProperties.getGroq());
            }
            case OPENROUTER -> {
                validateKey(aiProperties.getOpenrouter().getApiKey(), "OPENROUTER_API_KEY");
                yield new OpenRouterAiClient(aiProperties.getOpenrouter());
            }
            default -> {
                log.warn("Using Mock AI provider — set AI_PROVIDER env var to use a real AI");
                yield new MockAiClient();
            }
        };
    }

    private void validateKey(String key, String envVarName) {
        if (key == null || key.isBlank()) {
            throw new IllegalStateException(
                    "AI provider API key is missing. Set the " + envVarName + " environment variable."
            );
        }
    }
}
