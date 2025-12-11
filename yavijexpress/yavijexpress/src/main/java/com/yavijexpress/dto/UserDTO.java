package com.yavijexpress.dto;

import lombok.Data;

public class UserDTO {

    @Data
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String mobile;
        private String role;
        private String verificationStatus;
        private Double avgRating;
        private Integer totalRides;
        private Boolean isActive;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getVerificationStatus() {
            return verificationStatus;
        }

        public void setVerificationStatus(String verificationStatus) {
            this.verificationStatus = verificationStatus;
        }

        public Double getAvgRating() {
            return avgRating;
        }

        public void setAvgRating(Double avgRating) {
            this.avgRating = avgRating;
        }

        public Integer getTotalRides() {
            return totalRides;
        }

        public void setTotalRides(Integer totalRides) {
            this.totalRides = totalRides;
        }

        public Boolean getActive() {
            return isActive;
        }

        public void setActive(Boolean active) {
            isActive = active;
        }
    }

    @Data
    public static class UserUpdateRequest {
        private String name;
        private String mobile;
        private String emergencyContact1;
        private String emergencyContact2;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getEmergencyContact1() {
            return emergencyContact1;
        }

        public void setEmergencyContact1(String emergencyContact1) {
            this.emergencyContact1 = emergencyContact1;
        }

        public String getEmergencyContact2() {
            return emergencyContact2;
        }

        public void setEmergencyContact2(String emergencyContact2) {
            this.emergencyContact2 = emergencyContact2;
        }
    }

    @Data
    public static class DriverVerificationRequest {
        private String aadhaarNumber;
        private String drivingLicense;

        public String getAadhaarNumber() {
            return aadhaarNumber;
        }

        public void setAadhaarNumber(String aadhaarNumber) {
            this.aadhaarNumber = aadhaarNumber;
        }

        public String getDrivingLicense() {
            return drivingLicense;
        }

        public void setDrivingLicense(String drivingLicense) {
            this.drivingLicense = drivingLicense;
        }
    }

    @Data
    public static class KYCStatusUpdateRequest {
        private Long userId;
        private String status; // VERIFIED, REJECTED
        private String remarks;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }
}