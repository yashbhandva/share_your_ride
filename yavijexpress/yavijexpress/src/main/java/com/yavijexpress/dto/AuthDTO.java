package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class AuthDTO {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RegisterRequest {
        @NotBlank private String name;
        @Email @NotBlank private String email;
        @NotBlank @Size(min = 8) private String password;
        @NotBlank @Pattern(regexp = "^[0-9]{10}$") private String mobile;
        @NotBlank private String role; // ADMIN, DRIVER, PASSENGER
        @NotBlank @Pattern(regexp = "^[0-9]{12}$") private String aadhaarNumber;
        private String drivingLicense; // Optional, only required for drivers
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginRequest {
        @NotBlank private String email;
        @NotBlank private String password;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OTPVerifyRequest {
        @NotBlank private String email;
        @NotBlank @Pattern(regexp = "^[0-9]{6}$") private String otp;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private String name;
        private String role;
        private String mobile;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PasswordChangeRequest {
        @NotBlank private String oldPassword;
        @NotBlank @Size(min = 8) private String newPassword;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ForgotPasswordRequest {
        @Email @NotBlank private String email;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PasswordResetRequest {
        @NotBlank private String token;
        @NotBlank @Size(min = 8) private String newPassword;
    }
}