package com.uniflow.blog.service;

import com.uniflow.blog.domain.User;
import com.uniflow.blog.dto.ai.AiRequest;
import com.uniflow.blog.dto.ai.AiRequestHistoryDto;
import com.uniflow.blog.dto.ai.AiResponse;
import com.uniflow.blog.kafka.event.AiRequestEvent;
import com.uniflow.blog.kafka.producer.AiRequestProducer;
import com.uniflow.blog.mapper.AiRequestHistoryMapper;
import com.uniflow.blog.repository.AiRequestHistoryRepository;
import com.uniflow.blog.repository.UserRepository;
import com.uniflow.blog.util.ai.AiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;

import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private static final String CACHE_PREFIX = "ai:cache:";
    private static final Duration CACHE_TTL = Duration.ofHours(1);

    private final UserRepository userRepository;
    private final AiRequestHistoryRepository aiRequestHistoryRepository;
    private final AiRequestHistoryMapper aiRequestHistoryMapper;
    private final AiRateLimiterService aiRateLimiterService;
    private final AiRequestProducer aiRequestProducer;
    private final AiClient aiClient;
    private final RedisTemplate<String, Object> redisTemplate;

    public AiResponse ask(AiRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

        aiRateLimiterService.checkAndIncrement(user.getId(), user.getRole());

        String cacheKey = buildCacheKey(request.getPrompt());
        String cachedResponse = (String) redisTemplate.opsForValue().get(cacheKey);

        if (cachedResponse != null) {
            log.debug("AI cache hit for userId={}", user.getId());
            publishEvent(user.getId(), request.getPrompt(), cachedResponse, true);
            return AiResponse.builder()
                    .prompt(request.getPrompt())
                    .response(cachedResponse)
                    .cached(true)
                    .provider(aiClient.getProviderName())
                    .build();
        }

        String aiResponse = aiClient.call(request.getPrompt());

        redisTemplate.opsForValue().set(cacheKey, aiResponse, CACHE_TTL);
        log.debug("AI response cached for userId={}", user.getId());

        publishEvent(user.getId(), request.getPrompt(), aiResponse, false);

        return AiResponse.builder()
                .prompt(request.getPrompt())
                .response(aiResponse)
                .cached(false)
                .provider(aiClient.getProviderName())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<AiRequestHistoryDto> getHistory(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));

        return aiRequestHistoryRepository
                .findAllByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(aiRequestHistoryMapper::toDto);
    }

    public long getRemainingRequests(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userEmail));
        return aiRateLimiterService.getRemainingRequests(user.getId(), user.getRole());
    }

    private void publishEvent(Long userId, String prompt, String response, boolean cached) {
        AiRequestEvent event = AiRequestEvent.builder()
                .userId(userId)
                .prompt(prompt)
                .response(response)
                .cached(cached)
                .occurredAt(LocalDateTime.now())
                .build();
        aiRequestProducer.send(event);
    }

    private String buildCacheKey(String prompt) {
        return CACHE_PREFIX + DigestUtils.md5DigestAsHex(prompt.getBytes());
    }
}
