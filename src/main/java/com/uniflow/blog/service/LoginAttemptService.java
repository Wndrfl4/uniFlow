package com.uniflow.blog.service;

import com.uniflow.blog.exception.AccountLockedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private static final String ATTEMPTS_PREFIX = "login_attempts:";
    private static final String LOCK_PREFIX = "login_lock:";

    private final StringRedisTemplate redisTemplate;

    @Value("${app.security.max-login-attempts:5}")
    private int maxAttempts;

    @Value("${app.security.lock-duration-minutes:15}")
    private long lockDurationMinutes;

    public void checkNotLocked(String email) {
        String lockKey = LOCK_PREFIX + email.toLowerCase();
        Long ttl = redisTemplate.getExpire(lockKey, TimeUnit.SECONDS);
        if (ttl != null && ttl > 0) {
            log.warn("Blocked login attempt for locked account: {}", email);
            throw new AccountLockedException(ttl);
        }
    }

    public void recordFailure(String email) {
        String attemptsKey = ATTEMPTS_PREFIX + email.toLowerCase();
        Long attempts = redisTemplate.opsForValue().increment(attemptsKey);
        redisTemplate.expire(attemptsKey, Duration.ofMinutes(lockDurationMinutes));

        if (attempts != null && attempts >= maxAttempts) {
            String lockKey = LOCK_PREFIX + email.toLowerCase();
            redisTemplate.opsForValue().set(lockKey, "1", Duration.ofMinutes(lockDurationMinutes));
            redisTemplate.delete(attemptsKey);
            log.warn("Account locked after {} failed attempts: {}", attempts, email);
        } else {
            log.warn("Failed login attempt {}/{} for: {}", attempts, maxAttempts, email);
        }
    }

    public void recordSuccess(String email) {
        redisTemplate.delete(ATTEMPTS_PREFIX + email.toLowerCase());
        redisTemplate.delete(LOCK_PREFIX + email.toLowerCase());
    }
}
