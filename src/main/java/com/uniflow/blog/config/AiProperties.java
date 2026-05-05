package com.uniflow.blog.config;

import com.uniflow.blog.util.ai.AiProvider;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.ai")
public class AiProperties {

    private AiProvider provider = AiProvider.MOCK;

    private Gemini gemini = new Gemini();
    private Groq groq = new Groq();
    private Openrouter openrouter = new Openrouter();

    @Data
    public static class Gemini {
        private String apiKey = "";
        private String model = "gemini-1.5-flash";
        private String baseUrl = "https://generativelanguage.googleapis.com";
    }

    @Data
    public static class Groq {
        private String apiKey = "";
        private String model = "llama-3.3-70b-versatile";
        private String baseUrl = "https://api.groq.com";
    }

    @Data
    public static class Openrouter {
        private String apiKey = "";
        private String model = "meta-llama/llama-3.2-3b-instruct:free";
        private String baseUrl = "https://openrouter.ai";
        private String siteUrl = "http://localhost:8080";
        private String siteName = "UniFlow Blog";
    }
}
