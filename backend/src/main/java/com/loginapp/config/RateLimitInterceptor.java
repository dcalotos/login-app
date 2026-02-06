package com.loginapp.config;

import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {
    
    private final RateLimitConfig rateLimitConfig;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();
        String clientIp = getClientIP(request);
        
        Bucket bucket = getBucketForEndpoint(uri, clientIp);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            // Request allowed
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            return true;
        } else {
            // Rate limit exceeded
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(String.format(
                "{\"error\":\"Too many requests\",\"message\":\"Rate limit exceeded. Try again in %d seconds\",\"retryAfter\":%d}",
                waitForRefill, waitForRefill
            ));
            response.addHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(waitForRefill));
            
            log.warn("Rate limit exceeded for IP: {} on endpoint: {}", clientIp, uri);
            return false;
        }
    }
    
    private Bucket getBucketForEndpoint(String uri, String clientIp) {
        if (uri.contains("/auth/login")) {
            return rateLimitConfig.getAuthBucket(clientIp);
        } else if (uri.contains("/auth/register")) {
            return rateLimitConfig.getRegistrationBucket(clientIp);
        } else if (uri.contains("/forgot-password") || uri.contains("/reset-password")) {
            return rateLimitConfig.getPasswordResetBucket(clientIp);
        } else {
            return rateLimitConfig.getGeneralBucket(clientIp);
        }
    }
    
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
