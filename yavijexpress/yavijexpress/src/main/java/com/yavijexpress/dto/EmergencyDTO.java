package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

public class EmergencyDTO {

    @Data
    public static class SOSRequest {
        @NotNull private Long tripId;
        @NotBlank private String message;
        private Double latitude;
        private Double longitude;

        public Long getTripId() {
            return tripId;
        }

        public void setTripId(Long tripId) {
            this.tripId = tripId;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Double getLatitude() {
            return latitude;
        }

        public void setLatitude(Double latitude) {
            this.latitude = latitude;
        }

        public Double getLongitude() {
            return longitude;
        }

        public void setLongitude(Double longitude) {
            this.longitude = longitude;
        }
    }

    @Data
    public static class EmergencyAlertResponse {
        private Long alertId;
        private String status;
        private String message;
        private LocalDateTime sentAt;
        private Boolean authoritiesNotified;

        public Long getAlertId() {
            return alertId;
        }

        public void setAlertId(Long alertId) {
            this.alertId = alertId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public LocalDateTime getSentAt() {
            return sentAt;
        }

        public void setSentAt(LocalDateTime sentAt) {
            this.sentAt = sentAt;
        }

        public Boolean getAuthoritiesNotified() {
            return authoritiesNotified;
        }

        public void setAuthoritiesNotified(Boolean authoritiesNotified) {
            this.authoritiesNotified = authoritiesNotified;
        }
    }

    @Data
    public static class LiveLocationRequest {
        @NotNull private Long tripId;
        @NotNull private Double latitude;
        @NotNull private Double longitude;

        public Long getTripId() {
            return tripId;
        }

        public void setTripId(Long tripId) {
            this.tripId = tripId;
        }

        public Double getLatitude() {
            return latitude;
        }

        public void setLatitude(Double latitude) {
            this.latitude = latitude;
        }

        public Double getLongitude() {
            return longitude;
        }

        public void setLongitude(Double longitude) {
            this.longitude = longitude;
        }
    }
}