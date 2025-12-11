package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

public class ComplaintDTO {

    @Data
    public static class ComplaintRequest {
        @NotBlank private String title;
        @NotBlank private String description;
        @NotBlank private String type;
        private Long reportedUserId;
        private Long tripId;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Long getReportedUserId() {
            return reportedUserId;
        }

        public void setReportedUserId(Long reportedUserId) {
            this.reportedUserId = reportedUserId;
        }

        public Long getTripId() {
            return tripId;
        }

        public void setTripId(Long tripId) {
            this.tripId = tripId;
        }
    }

    @Data
    public static class ComplaintResponse {
        private Long id;
        private String title;
        private String description;
        private String type;
        private String status;
        private String reportedByName;
        private String reportedUserName;
        private String adminResponse;
        private LocalDateTime createdAt;
        private LocalDateTime resolvedAt;

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

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getReportedByName() {
            return reportedByName;
        }

        public void setReportedByName(String reportedByName) {
            this.reportedByName = reportedByName;
        }

        public String getReportedUserName() {
            return reportedUserName;
        }

        public void setReportedUserName(String reportedUserName) {
            this.reportedUserName = reportedUserName;
        }

        public String getAdminResponse() {
            return adminResponse;
        }

        public void setAdminResponse(String adminResponse) {
            this.adminResponse = adminResponse;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public LocalDateTime getResolvedAt() {
            return resolvedAt;
        }

        public void setResolvedAt(LocalDateTime resolvedAt) {
            this.resolvedAt = resolvedAt;
        }
    }

    @Data
    public static class ComplaintUpdateRequest {
        @NotBlank private String status; // IN_PROGRESS, RESOLVED, REJECTED
        private String adminResponse;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getAdminResponse() {
            return adminResponse;
        }

        public void setAdminResponse(String adminResponse) {
            this.adminResponse = adminResponse;
        }
    }
}