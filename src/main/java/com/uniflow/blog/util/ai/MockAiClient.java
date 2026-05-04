package com.uniflow.blog.util.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@ConditionalOnProperty(name = "app.ai.mock-enabled", havingValue = "true", matchIfMissing = true)
public class MockAiClient implements AiClient {

    @Override
    public String call(String prompt) {
        log.debug("Mock AI called with prompt: {}", prompt);
        return "This is a mock AI response for the prompt: \"" + prompt + "\". "
                + "In production this will be replaced with a real AI API call.";
    }
}
