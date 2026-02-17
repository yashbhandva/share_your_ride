package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class ComplaintDTO {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ComplaintRequest {
        @NotBlank
        private String title;
        @NotBlank
        private String description;
        @NotBlank
        private String type;
        private Long reportedUserId;
        private Long tripId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
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
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ComplaintUpdateRequest {
        @NotBlank
        private String status; // IN_PROGRESS, RESOLVED, REJECTED
        private String adminResponse;
    }
}