package com.yavijexpress.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

public class NotificationDTO {

    @Data
    public static class NotificationResponse {
        private Long id;
        private String title;
        private String message;
        private String type;
        private Boolean isRead;
        private String relatedEntityType;
        private Long relatedEntityId;
        private LocalDateTime createdAt;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Boolean getIsRead() {
            return isRead;
        }

        public void setIsRead(Boolean read) {
            isRead = read;
        }

        public String getRelatedEntityType() {
            return relatedEntityType;
        }

        public void setRelatedEntityType(String relatedEntityType) {
            this.relatedEntityType = relatedEntityType;
        }

        public Long getRelatedEntityId() {
            return relatedEntityId;
        }

        public void setRelatedEntityId(Long relatedEntityId) {
            this.relatedEntityId = relatedEntityId;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }

    @Data
    public static class NotificationMarkReadRequest {
        @NotNull
        private Long notificationId;

        public Long getNotificationId() {
            return notificationId;
        }

        public void setNotificationId(Long notificationId) {
            this.notificationId = notificationId;
        }
    }
}