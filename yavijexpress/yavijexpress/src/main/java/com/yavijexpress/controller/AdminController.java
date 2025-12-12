package com.yavijexpress.controller;

import com.yavijexpress.dto.AdminDTO;
import com.yavijexpress.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.yavijexpress.dto.NotificationDTO;
import com.yavijexpress.service.NotificationService;
import com.yavijexpress.entity.User;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final NotificationService notificationService;

    public AdminController(AdminService adminService, NotificationService notificationService) {
        this.adminService = adminService;
        this.notificationService = notificationService;
    }

    @PostMapping("/notifications")
    public ResponseEntity<?> createBroadcastNotification(
            @RequestBody NotificationDTO.AdminNotificationRequest request) {
        try {
            String target = request.getTargetAudience().toUpperCase();

            if ("ALL".equals(target)) {
                notificationService.sendBroadcastNotificationToAll(
                        request.getTitle(),
                        request.getMessage()
                );
            } else if ("DRIVER".equals(target)) {
                notificationService.sendBroadcastNotification(
                        User.UserRole.DRIVER,
                        request.getTitle(),
                        request.getMessage()
                );
            } else if ("PASSENGER".equals(target)) {
                notificationService.sendBroadcastNotification(
                        User.UserRole.PASSENGER,
                        request.getTitle(),
                        request.getMessage()
                );
            } else {
                return ResponseEntity.badRequest().body(
                        com.yavijexpress.dto.ApiResponse.error("Invalid targetAudience")
                );
            }

            return ResponseEntity.ok(
                    com.yavijexpress.dto.ApiResponse.success(null, "Notification sent successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    com.yavijexpress.dto.ApiResponse.error("Failed to send notification: " + e.getMessage())
            );
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            AdminDTO.DashboardStats stats = adminService.getDashboardStats();
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(stats, "Dashboard stats retrieved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to get dashboard stats: " + e.getMessage())
            );
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<AdminDTO.UserManagement> users = adminService.getAllUsers(page, size);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(users, "Users retrieved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to get users: " + e.getMessage())
            );
        }
    }

    @GetMapping("/trips")
    public ResponseEntity<?> getAllTrips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            List<AdminDTO.TripManagement> trips = adminService.getAllTrips(page, size);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(trips, "Trips retrieved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to get trips: " + e.getMessage())
            );
        }
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestParam Boolean isActive) {
        try {
            AdminDTO.UserManagement user = adminService.updateUserStatus(userId, isActive);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(user, "User status updated"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to update user status: " + e.getMessage())
            );
        }
    }

    @PutMapping("/users/{userId}/verification")
    public ResponseEntity<?> updateUserVerification(@PathVariable Long userId, @RequestParam String status) {
        try {
            AdminDTO.UserManagement user = adminService.updateUserVerification(userId, status);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(user, "User verification updated"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to update verification: " + e.getMessage())
            );
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(null, "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to delete user: " + e.getMessage())
            );
        }
    }

    @DeleteMapping("/trips/{tripId}")
    public ResponseEntity<?> deleteTrip(@PathVariable Long tripId) {
        try {
            adminService.deleteTrip(tripId);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(null, "Trip deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to delete trip: " + e.getMessage())
            );
        }
    }
}