package com.loginapp.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {
    
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    /**
     * Get or create a bucket for the given key with specified limits.
     */
    public Bucket resolveBucket(String key, long capacity, Duration refillDuration) {
        return cache.computeIfAbsent(key, k -> createNewBucket(capacity, refillDuration));
    }
    
    /**
     * Create a new bucket with specified capacity and refill rate.
     */
    private Bucket createNewBucket(long capacity, Duration refillDuration) {
        Bandwidth limit = Bandwidth.classic(capacity, Refill.intervally(capacity, refillDuration));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    /**
     * Get bucket for authentication endpoints (more restrictive).
     * Allows 5 requests per 15 minutes.
     */
    public Bucket getAuthBucket(String key) {
        return resolveBucket("auth:" + key, 5, Duration.ofMinutes(15));
    }
    
    /**
     * Get bucket for password reset endpoints (restrictive).
     * Allows 3 requests per hour.
     */
    public Bucket getPasswordResetBucket(String key) {
        return resolveBucket("reset:" + key, 3, Duration.ofHours(1));
    }
    
    /**
     * Get bucket for registration endpoint.
     * Allows 3 requests per hour.
     */
    public Bucket getRegistrationBucket(String key) {
        return resolveBucket("register:" + key, 3, Duration.ofHours(1));
    }
    
    /**
     * Get bucket for general API endpoints.
     * Allows 100 requests per minute.
     */
    public Bucket getGeneralBucket(String key) {
        return resolveBucket("general:" + key, 100, Duration.ofMinutes(1));
    }
    
    /**
     * Clear the cache for a specific key (useful for testing or admin purposes).
     */
    public void clearBucket(String key) {
        cache.remove(key);
    }
    
    /**
     * Clear all buckets from cache.
     */
    public void clearAllBuckets() {
        cache.clear();
    }
}
