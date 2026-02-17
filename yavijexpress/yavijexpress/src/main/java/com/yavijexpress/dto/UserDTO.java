package com.yavijexpress.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

public class UserDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String mobile;
        private String role;
        private String verificationStatus;
        private String aadhaarNumber;
        private String drivingLicense;
        private Double avgRating;
        private Integer totalRides;
        private Boolean isActive;
        private LocalDateTime createdAt;
        // ADD THESE MISSING FIELDS:
        private LocalDateTime updatedAt;
        private Set<VehicleDTO.VehicleResponse> vehicles; // For drivers only

    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserUpdateRequest {
        private String name;
        private String mobile;
        private String emergencyContact1;
        private String emergencyContact2;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DriverVerificationRequest {
        private String aadhaarNumber;
        private String drivingLicense;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class KYCStatusUpdateRequest {
        private Long userId;
        private String status; // VERIFIED, REJECTED
        private String remarks;
    }
}