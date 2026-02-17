package com.yavijexpress.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class NotificationDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NotificationResponse {
        private Long id;
        private String title;
        private String message;
        private String type;
        private Boolean isRead;
        private String relatedEntityType;
        private Long relatedEntityId;
        private String actions;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NotificationMarkReadRequest {
        @NotNull
        private Long notificationId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AdminNotificationRequest {
        @NotNull
        private String title;

        @NotNull
        private String message;

        // DRIVER, PASSENGER, or ALL
        @NotNull
        private String targetAudience;
    }
}