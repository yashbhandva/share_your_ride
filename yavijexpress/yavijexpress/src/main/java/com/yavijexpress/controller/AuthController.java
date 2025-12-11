package com.yavijexpress.controller;

import com.yavijexpress.dto.ApiResponse;
import com.yavijexpress.dto.AuthDTO;
import com.yavijexpress.service.UserService;
import com.yavijexpress.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody AuthDTO.RegisterRequest request) {
        return ResponseEntity.ok(
                ApiResponse.created(userService.register(request), "Registration successful. Please verify your email.")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDTO.JwtResponse>> login(@Valid @RequestBody AuthDTO.LoginRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(userService.login(request), "Login successful")
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<?>> verifyOTP(@Valid @RequestBody AuthDTO.OTPVerifyRequest request) {
        userService.verifyEmail(request.getEmail(), request.getOtp());
        return ResponseEntity.ok(
                ApiResponse.success(null, "Email verified successfully")
        );
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<?>> sendOTP(@RequestParam String email) {
        userService.sendOTP(email);
        return ResponseEntity.ok(
                ApiResponse.success(null, "OTP sent successfully")
        );
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> changePassword(
            @Valid @RequestBody AuthDTO.PasswordChangeRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        userService.changePassword(userId, request);
        return ResponseEntity.ok(
                ApiResponse.success(null, "Password changed successfully")
        );
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> logout() {
        // Logout handled by Spring Security
        return ResponseEntity.ok(
                ApiResponse.success(null, "Logged out successfully")
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@RequestParam String email) {
        userService.forgotPassword(email);
        return ResponseEntity.ok(
                ApiResponse.success(null, "If the email is registered, a password reset link has been sent")
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok(
                ApiResponse.success(null, "Password has been reset successfully")
        );
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> getProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(
                ApiResponse.success(userService.getProfile(userId), "Profile retrieved successfully")
        );
    }
}