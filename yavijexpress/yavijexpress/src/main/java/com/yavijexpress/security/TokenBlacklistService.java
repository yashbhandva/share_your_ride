package com.yavijexpress.security;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Map<String, TokenBlacklistEntry> blacklistedTokens = new ConcurrentHashMap<>();

    public void blacklistToken(String token) {
        blacklistedTokens.put(token, new TokenBlacklistEntry(token, LocalDateTime.now()));
        logBlacklistAction(token, "added");
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }

    public void removeToken(String token) {
        blacklistedTokens.remove(token);
        logBlacklistAction(token, "removed");
    }

    // Clean up expired tokens every hour
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupExpiredTokens() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24); // Keep for 24 hours
        int initialSize = blacklistedTokens.size();

        blacklistedTokens.entrySet().removeIf(entry ->
                entry.getValue().getBlacklistedAt().isBefore(cutoffTime)
        );

        int removedCount = initialSize - blacklistedTokens.size();
        if (removedCount > 0) {
            System.out.println("Cleaned up " + removedCount + " expired blacklisted tokens");
        }
    }

    private void logBlacklistAction(String token, String action) {
        String tokenPreview = token.length() > 10 ?
                token.substring(0, 10) + "..." : token;
        System.out.println("Token " + tokenPreview + " " + action + " to blacklist");
    }

    private static class TokenBlacklistEntry {
        private final String token;
        private final LocalDateTime blacklistedAt;

        public TokenBlacklistEntry(String token, LocalDateTime blacklistedAt) {
            this.token = token;
            this.blacklistedAt = blacklistedAt;
        }

        public String getToken() { return token; }
        public LocalDateTime getBlacklistedAt() { return blacklistedAt; }
    }
}