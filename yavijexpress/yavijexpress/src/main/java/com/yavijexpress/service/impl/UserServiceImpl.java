package com.yavijexpress.service.impl;

import com.yavijexpress.dto.*;
import com.yavijexpress.entity.*;
import com.yavijexpress.exception.*;
import com.yavijexpress.repository.*;
import com.yavijexpress.security.JwtService;
import com.yavijexpress.service.*;
import com.yavijexpress.utils.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailServiceImpl emailService;
    private final OTPService otpService;
    private final ModelMapper modelMapper;

    public UserServiceImpl(UserRepository userRepository, VehicleRepository vehicleRepository, NotificationRepository notificationRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, EmailServiceImpl emailService, OTPService otpService, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.otpService = otpService;
        this.modelMapper = modelMapper;
    }
    @Override
    public User register(AuthDTO.RegisterRequest request) {
        // Check if user already exists (collect all duplicate errors)
        boolean emailExists = userRepository.existsByEmail(request.getEmail());
        boolean mobileExists = userRepository.existsByMobile(request.getMobile());

        if (emailExists || mobileExists) {
            StringBuilder sb = new StringBuilder();
            if (emailExists) {
                sb.append("Email already registered.");
            }
            if (mobileExists) {
                if (sb.length() > 0) {
                    sb.append("\n");
                }
                sb.append("Mobile number already registered.");
            }
            // Use your existing BadRequestException
            throw new BadRequestException(sb.toString());
        }

        // Validate role
        User.UserRole role;
        try {
            role = User.UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role. Allowed: ADMIN, DRIVER, PASSENGER");
        }

        // Create user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());
        user.setRole(role);
        user.setVerificationStatus(User.VerificationStatus.PENDING);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Send verification email
        String otp = otpService.generateOTP(request.getEmail());
        emailService.sendVerificationEmail(request.getEmail(), request.getName(), otp);

        // Create welcome notification
        Notification notification = new Notification();
        notification.setUser(savedUser);
        notification.setTitle("Welcome to YaVij Express!");
        notification.setMessage("Thank you for registering. Please verify your email.");
        notification.setType(Notification.NotificationType.INFO);
        notificationRepository.save(notification);

        return savedUser;
    }

    @Override
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }
    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // TODO: generate and store a secure reset token (e.g., UUID or JWT)
        // String resetToken = ...;

        // TODO: send reset email with link containing the token
        // emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetToken);
        throw new UnsupportedOperationException("Password reset flow not fully implemented yet");
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        // TODO: validate token, load associated user, check expiry

        // Example flow (pseudocode):
        // PasswordResetToken prt = tokenRepo.findByToken(token).orElseThrow(...);
        // if (prt.isExpired()) { ... }
        // User user = prt.getUser();

        // user.setPassword(passwordEncoder.encode(newPassword));
        // userRepository.save(user);
        // tokenRepo.markUsed(prt);

        throw new UnsupportedOperationException("Password reset flow not fully implemented yet");
    }
    @Override
    public void deactivateUser(Long userId) {
        User user = getUserById(userId);
        if (!Boolean.FALSE.equals(user.getIsActive())) {
            user.setIsActive(false);
            userRepository.save(user);

            Notification notification = new Notification();
            notification.setUser(user);
            notification.setTitle("Account Deactivated");
            notification.setMessage("Your account has been deactivated. You will not be able to login.");
            notification.setType(Notification.NotificationType.INFO);
            notificationRepository.save(notification);
        }
    }

    @Override
    public void reactivateUser(Long userId) {
        User user = getUserById(userId);
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            user.setIsActive(true);
            userRepository.save(user);

            Notification notification = new Notification();
            notification.setUser(user);
            notification.setTitle("Account Reactivated");
            notification.setMessage("Your account has been reactivated. You can now login again.");
            notification.setType(Notification.NotificationType.SUCCESS);
            notificationRepository.save(notification);
        }
    }

    @Override
    public void updateUserStatus(Long userId, Boolean isActive) {
        User user = getUserById(userId);
        user.setIsActive(isActive);
        userRepository.save(user);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle("Account Status Updated");
        notification.setMessage("Your account status has been changed to: " + (isActive ? "ACTIVE" : "INACTIVE"));
        notification.setType(Notification.NotificationType.INFO);
        notificationRepository.save(notification);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByMobile(String mobile) {
        return userRepository.existsByMobile(mobile);
    }

    @Override
    public List<UserDTO.UserResponse> getPendingDriverVerifications() {
        List<User> pendingDrivers = userRepository
                .findByRoleAndVerificationStatus(User.UserRole.DRIVER, User.VerificationStatus.PENDING);

        return pendingDrivers.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void changePassword(Long userId, AuthDTO.PasswordChangeRequest request) {
        User user = getUserById(userId);

        // Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        // Prevent reusing same password
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("New password must be different from the current password");
        }

        // Set new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Optional: add a security notification
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle("Password Changed");
        notification.setMessage("Your account password was changed. If this was not you, please contact support immediately.");
        notification.setType(Notification.NotificationType.WARNING);
        notificationRepository.save(notification);
    }
    @Override
    public AuthDTO.JwtResponse login(AuthDTO.LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        // Allow unverified users to login and access profile
        // if (user.getVerificationStatus() == User.VerificationStatus.PENDING) {
        //     throw new UnauthorizedException("Please verify your email first");
        // }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                .accountLocked(!user.getIsActive())
                .disabled(!user.getIsActive())
                .build();

        String jwtToken = jwtService.generateToken(userDetails);
        AuthDTO.JwtResponse response = new AuthDTO.JwtResponse();
        response.setToken(jwtToken);
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(user.getRole().toString());
        response.setMobile(user.getMobile());

        return response;
    }

    @Override
    public void verifyEmail(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!otpService.validateOTP(email, otp)) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        user.setVerificationStatus(User.VerificationStatus.VERIFIED);
        userRepository.save(user);

        // Send verification success notification
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle("Email Verified Successfully!");
        notification.setMessage("Your email has been verified. You can now use all features.");
        notification.setType(Notification.NotificationType.SUCCESS);
        notificationRepository.save(notification);
    }

    @Override
    public void sendOTP(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new ResourceNotFoundException("Email not registered");
        }

        String otp = otpService.generateOTP(email);
        User user = userRepository.findByEmail(email).get();

        emailService.sendOTPEmail(email, user.getName(), otp);
    }

    @Override
    public UserDTO.UserResponse getProfile(Long userId) {
        User user = getUserById(userId);
        return convertToUserResponse(user);
    }

    @Override
    public UserDTO.UserResponse updateProfile(Long userId, UserDTO.UserUpdateRequest request) {
        User user = getUserById(userId);

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getMobile() != null) {
            // Check if mobile already exists for another user
            userRepository.findByMobile(request.getMobile())
                    .ifPresent(existingUser -> {
                        if (!existingUser.getId().equals(userId)) {
                            throw new ResourceAlreadyExistsException("Mobile number already in use");
                        }
                    });
            user.setMobile(request.getMobile());
        }
        if (request.getEmergencyContact1() != null) {
            user.setEmergencyContact1(request.getEmergencyContact1());
        }
        if (request.getEmergencyContact2() != null) {
            user.setEmergencyContact2(request.getEmergencyContact2());
        }

        User updatedUser = userRepository.save(user);
        return convertToUserResponse(updatedUser);
    }

    @Override
    public void submitDriverVerification(Long userId, UserDTO.DriverVerificationRequest request) {
        User user = getUserById(userId);

        if (user.getRole() != User.UserRole.DRIVER) {
            throw new BadRequestException("Only drivers can submit verification");
        }

        user.setAadhaarNumber(request.getAadhaarNumber());
        user.setDrivingLicense(request.getDrivingLicense());
        user.setVerificationStatus(User.VerificationStatus.PENDING);

        userRepository.save(user);

        // Notify admin about new verification request
        List<User> admins = userRepository.findByRole(User.UserRole.ADMIN);
        admins.forEach(admin -> {
            Notification notification = new Notification();
            notification.setUser(admin);
            notification.setTitle("New Driver Verification Request");
            notification.setMessage("Driver " + user.getName() + " has submitted verification documents.");
            notification.setType(Notification.NotificationType.WARNING);
            notificationRepository.save(notification);
        });
    }

    @Override
    public List<UserDTO.UserResponse> getAllUsers(String role) {
        List<User> users;
        if (role != null && !role.isEmpty()) {
            try {
                User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
                users = userRepository.findByRole(userRole);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid role");
            }
        } else {
            users = userRepository.findAll();
        }

        return users.stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateKYCStatus(UserDTO.KYCStatusUpdateRequest request) {
        User user = getUserById(request.getUserId());

        try {
            User.VerificationStatus status = User.VerificationStatus.valueOf(request.getStatus());
            user.setVerificationStatus(status);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status");
        }

        userRepository.save(user);

        // Notify user about KYC status update
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle("KYC Status Updated");
        notification.setMessage("Your KYC verification status has been updated to: " + request.getStatus());
        notification.setType(Notification.NotificationType.INFO);
        notificationRepository.save(notification);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    // Helper method
    private UserDTO.UserResponse convertToUserResponse(User user) {
        UserDTO.UserResponse response = modelMapper.map(user, UserDTO.UserResponse.class);
        response.setVerificationStatus(user.getVerificationStatus().toString());
        response.setRole(user.getRole().toString());
        return response;
    }
}