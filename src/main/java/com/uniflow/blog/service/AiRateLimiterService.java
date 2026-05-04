package com.uniflow.blog.service;

import com.uniflow.blog.domain.enums.Role;
import com.uniflow.blog.exception.ApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiRateLimiterService {

    private static final int STUDENT_LIMIT = 10;
    private static final int TEACHER_LIMIT = 50;
    private static final String KEY_PREFIX = "ai:ratelimit:";

    private final RedisTemplate<String, Object> redisTemplate;

    public void checkAndIncrement(Long userId, Role role) {
        if (role == Role.ADMIN) {
            return;
        }

        int limit = role == Role.STUDENT ? STUDENT_LIMIT : TEACHER_LIMIT;
        String key = buildKey(userId);

        Long currentCount = redisTemplate.opsForValue().increment(key);

        if (currentCount == 1) {
            Duration ttl = Duration.between(LocalDateTime.now(), LocalDateTime.of(LocalDate.now().plusDays(1), LocalTime.MIDNIGHT));
            redisTemplate.expire(key, ttl);
        }

        if (currentCount > limit) {
            log.warn("AI rate limit exceeded for userId={}, role={}, count={}/{}", userId, role, currentCount, limit);
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,
                    String.format("Daily AI request limit reached (%d/%d). Try again tomorrow.", limit, limit));
        }

        log.debug("AI rate limit check passed for userId={}: {}/{}", userId, currentCount, limit);
    }

    public long getRemainingRequests(Long userId, Role role) {
        if (role == Role.ADMIN) {
            return Long.MAX_VALUE;
        }

        int limit = role == Role.STUDENT ? STUDENT_LIMIT : TEACHER_LIMIT;
        String key = buildKey(userId);
        Object count = redisTemplate.opsForValue().get(key);
        long used = count == null ? 0L : Long.parseLong(count.toString());
        return Math.max(0, limit - used);
    }

    private String buildKey(Long userId) {
        return KEY_PREFIX + userId + ":" + LocalDate.now();
    }
}
