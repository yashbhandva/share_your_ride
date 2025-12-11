package com.yavijexpress.controller;

import com.yavijexpress.dto.*;
import com.yavijexpress.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final TripService tripService;
    private final BookingService bookingService;

    public AdminController(UserService userService, TripService tripService, BookingService bookingService) {
        this.userService = userService;
        this.tripService = tripService;
        this.bookingService = bookingService;
    }

    public static class UpdateStatusRequest {
        private Boolean isActive;
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }

    @PatchMapping("/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UpdateStatusRequest request
    ) {
        userService.updateUserStatus(userId, request.getIsActive());
        return ResponseEntity.ok(
                ApiResponse.success(null, "User status updated successfully")
        );
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        // Implementation for dashboard statistics
        return ResponseEntity.ok(Map.of(
                "totalUsers", 150,
                "totalTrips", 500,
                "totalRevenue", 25000.0,
                "activeDrivers", 45
        ));
    }


    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(
                ApiResponse.success(null, "User deleted successfully")
        );
    }
    @PostMapping("/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok(
                ApiResponse.success(null, "User deactivated successfully")
        );
    }

    @PostMapping("/{userId}/reactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<?>> reactivateUser(@PathVariable Long userId) {
        userService.reactivateUser(userId);
        return ResponseEntity.ok(
                ApiResponse.success(null, "User reactivated successfully")
        );
    }
    @PostMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam Boolean isActive) {
        userService.updateUserStatus(userId, isActive);
        return ResponseEntity.ok("User status updated");
    }

    @PostMapping("/kyc/verify")
    public ResponseEntity<?> updateKYCStatus(
            @RequestBody UserDTO.KYCStatusUpdateRequest request) {
        userService.updateKYCStatus(request);
        return ResponseEntity.ok("KYC status updated");
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String role) {
        return ResponseEntity.ok(userService.getAllUsers(role));
    }

    @GetMapping("/trips")
    public ResponseEntity<?> getAllTrips() {
        // Get all trips with filters
        return ResponseEntity.ok("All trips");
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        // Get all bookings with filters
        return ResponseEntity.ok("All bookings");
    }

    @PostMapping("/emergency/alert")
    public ResponseEntity<?> sendEmergencyAlert(
            @RequestParam Long tripId,
            @RequestParam String message) {
        // Send emergency alert to all in trip
        return ResponseEntity.ok("Emergency alert sent");
    }
}