package com.uniflow.blog.util.ai;

public interface AiClient {

    String call(String prompt);

    default String getProviderName() {
        return "Unknown";
    }
}
