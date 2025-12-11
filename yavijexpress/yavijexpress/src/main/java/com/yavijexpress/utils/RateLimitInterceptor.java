package com.yavijexpress.utils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String clientId = getClientIdentifier(request);
        RequestCounter counter = requestCounts.computeIfAbsent(
                clientId, k -> new RequestCounter()
        );

        if (counter.isRateLimited()) {
            response.setStatus(429); // Too Many Requests
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"error\":\"Rate limit exceeded\",\"message\":\"Please wait before making another emergency call\"}"
            );
            return false;
        }

        counter.increment();
        return true;
    }

    private String getClientIdentifier(HttpServletRequest request) {
        // Use IP address + user agent as identifier
        String ip = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        return ip + ":" + (userAgent != null ? userAgent.hashCode() : "unknown");
    }

    private static class RequestCounter {
        private int count = 0;
        private long lastResetTime = System.currentTimeMillis();

        public synchronized boolean isRateLimited() {
            long currentTime = System.currentTimeMillis();

            // Reset counter if more than 1 minute has passed
            if (currentTime - lastResetTime > TimeUnit.MINUTES.toMillis(1)) {
                count = 0;
                lastResetTime = currentTime;
            }

            return count >= MAX_REQUESTS_PER_MINUTE;
        }

        public synchronized void increment() {
            count++;
        }
    }
}