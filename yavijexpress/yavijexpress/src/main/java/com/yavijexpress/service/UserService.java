package com.yavijexpress.service;

import com.yavijexpress.dto.AuthDTO;
import com.yavijexpress.dto.UserDTO;
import com.yavijexpress.entity.User;
import java.util.List;

public interface UserService {

    // Authentication
    User register(AuthDTO.RegisterRequest request);
    AuthDTO.JwtResponse login(AuthDTO.LoginRequest request);
    void verifyEmail(String email, String otp);
    void sendOTP(String email);
    void changePassword(Long userId, AuthDTO.PasswordChangeRequest request);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);

    // User Management
    UserDTO.UserResponse getProfile(Long userId);
    UserDTO.UserResponse updateProfile(Long userId, UserDTO.UserUpdateRequest request);
    void deleteUser(Long userId);
    void deactivateUser(Long userId);
    void reactivateUser(Long userId);

    // Driver Specific
    void submitDriverVerification(Long userId, UserDTO.DriverVerificationRequest request);
    List<UserDTO.UserResponse> getPendingDriverVerifications();

    // Admin Functions
    List<UserDTO.UserResponse> getAllUsers(String role);
    void updateUserStatus(Long userId, Boolean isActive);
    void updateKYCStatus(UserDTO.KYCStatusUpdateRequest request);

    // Utility
    User getUserById(Long userId);
    User getUserByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
}