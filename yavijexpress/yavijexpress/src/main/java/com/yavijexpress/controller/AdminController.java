package com.yavijexpress.controller;

import com.yavijexpress.dto.AdminDTO;
import com.yavijexpress.dto.ContactMessageDTO;
import com.yavijexpress.entity.ContactMessage;
import com.yavijexpress.repository.ContactMessageRepository;
import com.yavijexpress.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import com.yavijexpress.dto.NotificationDTO;
import com.yavijexpress.service.NotificationService;
import com.yavijexpress.entity.User;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final NotificationService notificationService;
    
    @Autowired
    private ContactMessageRepository contactMessageRepository;

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

    @GetMapping("/contacts/stats")
    public ResponseEntity<?> getContactStats() {
        try {
            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("total", contactMessageRepository.count());
            stats.put("new", contactMessageRepository.countByStatus(ContactMessage.Status.NEW));
            stats.put("inProgress", contactMessageRepository.countByStatus(ContactMessage.Status.IN_PROGRESS));
            stats.put("resolved", contactMessageRepository.countByStatus(ContactMessage.Status.RESOLVED));
            stats.put("closed", contactMessageRepository.countByStatus(ContactMessage.Status.CLOSED));
            
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(stats, "Contact stats retrieved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to get contact stats: " + e.getMessage())
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
            System.out.println("🔴 DEBUG: Attempting to delete user with ID: " + userId);
            adminService.deleteUser(userId);
            System.out.println("✅ DEBUG: User deleted successfully: " + userId);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(null, "User deleted successfully"));
        } catch (RuntimeException e) {
            System.err.println("❌ DEBUG: RuntimeException deleting user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(404).body(
                com.yavijexpress.dto.ApiResponse.error("User not found: " + e.getMessage())
            );
        } catch (Exception e) {
            System.err.println("❌ DEBUG: Exception deleting user " + userId + ": " + e.getMessage());
            e.printStackTrace();
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

    @GetMapping("/contacts")
    public ResponseEntity<?> getAllContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
            org.springframework.data.domain.Page<ContactMessage> contactPage = contactMessageRepository.findAll(pageable);
            
            List<ContactMessageDTO.ContactResponse> contacts = contactPage.getContent()
                .stream()
                .map(this::convertToContactResponse)
                .collect(Collectors.toList());
                
            java.util.Map<String, Object> response = new java.util.HashMap<>();
            response.put("contacts", contacts);
            response.put("totalElements", contactPage.getTotalElements());
            response.put("totalPages", contactPage.getTotalPages());
            response.put("currentPage", page);
            
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(response, "Contacts retrieved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to get contacts: " + e.getMessage())
            );
        }
    }

    @PutMapping("/contacts/{contactId}/status")
    public ResponseEntity<?> updateContactStatus(@PathVariable Long contactId, @RequestBody ContactMessageDTO.StatusUpdateRequest request) {
        try {
            System.out.println("Updating contact " + contactId + " to status: " + request.getStatus());
            
            ContactMessage contact = contactMessageRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
            
            System.out.println("Found contact: " + contact.getId() + ", current status: " + contact.getStatus());
            
            contact.setStatus(ContactMessage.Status.valueOf(request.getStatus().toUpperCase()));
            ContactMessage updated = contactMessageRepository.save(contact);
            
            System.out.println("Updated contact status to: " + updated.getStatus());
            
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(convertToContactResponse(updated), "Status updated successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to update status: " + e.getMessage())
            );
        }
    }

    @DeleteMapping("/contacts/{contactId}")
    public ResponseEntity<?> deleteContact(@PathVariable Long contactId) {
        try {
            contactMessageRepository.deleteById(contactId);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(null, "Contact deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to delete contact: " + e.getMessage())
            );
        }
    }

    private ContactMessageDTO.ContactResponse convertToContactResponse(ContactMessage contact) {
        ContactMessageDTO.ContactResponse response = new ContactMessageDTO.ContactResponse();
        response.setId(contact.getId());
        response.setName(contact.getName());
        response.setEmail(contact.getEmail());
        response.setSubject(contact.getSubject());
        response.setMessage(contact.getMessage());
        response.setStatus(contact.getStatus().toString());
        response.setCreatedAt(contact.getCreatedAt());
        response.setUpdatedAt(contact.getUpdatedAt());
        return response;
    }
}