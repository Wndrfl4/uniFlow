package com.uniflow.blog.util.ai;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MockAiClient implements AiClient {

    @Override
    public String call(String prompt) {
        log.debug("Mock AI called with prompt: {}", prompt);
        return "Это тестовый ответ AI на запрос: \"" + prompt + "\". "
                + "Для реальных ответов настройте переменную AI_PROVIDER (gemini, groq, openrouter) "
                + "и соответствующий API-ключ в файле .env";
    }

    @Override
    public String getProviderName() {
        return "Mock (локальный режим)";
    }
}
