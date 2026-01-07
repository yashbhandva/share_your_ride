package com.yavijexpress.dto;

import jakarta.validation.constraints.*;

public class AuthDTO {

    public static class RegisterRequest {
        @NotBlank private String name;
        @Email @NotBlank private String email;
        @NotBlank @Size(min = 8) private String password;
        @NotBlank @Pattern(regexp = "^[0-9]{10}$") private String mobile;
        @NotBlank private String role; // ADMIN, DRIVER, PASSENGER
        @NotBlank @Pattern(regexp = "^[0-9]{12}$") private String aadhaarNumber;
        private String drivingLicense; // Optional, only required for drivers

        public String getAadhaarNumber() {
            return aadhaarNumber;
        }

        public RegisterRequest(String name, String email, String password, String mobile, String role, String aadhaarNumber, String drivingLicense) {
            this.name = name;
            this.email = email;
            this.password = password;
            this.mobile = mobile;
            this.role = role;
            this.aadhaarNumber = aadhaarNumber;
            this.drivingLicense = drivingLicense;
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

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
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
    }

    public static class LoginRequest {
        @NotBlank private String email;
        @NotBlank private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class OTPVerifyRequest {
        @NotBlank private String email;
        @NotBlank @Pattern(regexp = "^[0-9]{6}$") private String otp;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }

    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private String name;
        private String role;
        private String mobile;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }
    }

    public static class PasswordChangeRequest {
        @NotBlank private String oldPassword;
        @NotBlank @Size(min = 8) private String newPassword;

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}