package com.yavijexpress.controller;

import com.yavijexpress.dto.ApiResponse;
import com.yavijexpress.dto.NotificationDTO;
import com.yavijexpress.entity.Notification;
import com.yavijexpress.exception.UnauthorizedException;
import com.yavijexpress.service.NotificationService;
import com.yavijexpress.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private  NotificationService notificationService;

    @Autowired
    private  com.yavijexpress.repository.NotificationRepository notificationRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<NotificationDTO.NotificationResponse>>> getUserNotifications() {
        Long userId = SecurityUtils.getCurrentUserId();

        List<NotificationDTO.NotificationResponse> notifications = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notification -> {
                    NotificationDTO.NotificationResponse response = new NotificationDTO.NotificationResponse();
                    response.setId(notification.getId());
                    response.setTitle(notification.getTitle());
                    response.setMessage(notification.getMessage());
                    response.setType(notification.getType().toString());
                    response.setIsRead(notification.getRead());
                    response.setRelatedEntityType(notification.getRelatedEntityType());
                    response.setRelatedEntityId(notification.getRelatedEntityId());
                    response.setActions(notification.getActions());
                    response.setCreatedAt(notification.getCreatedAt());
                    return response;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(notifications, "Notifications retrieved"));
    }

    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        Long userId = SecurityUtils.getCurrentUserId();
        Long count = notificationRepository.countByUserIdAndIsReadFalse(userId);

        return ResponseEntity.ok(ApiResponse.success(count, "Unread count retrieved"));
    }

    @PostMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> markAsRead(@PathVariable Long notificationId) {
        var notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new com.yavijexpress.exception.ResourceNotFoundException("Notification not found"));

        // Check ownership
        if (!notification.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new UnauthorizedException("Access denied");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);

        return ResponseEntity.ok(ApiResponse.success(null, "Notification marked as read"));
    }

    @PostMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> markAllAsRead() {
        Long userId = SecurityUtils.getCurrentUserId();

        List<Notification> notifications =
                notificationRepository.findByUserIdAndIsReadFalse(userId);

        notifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(notifications);

        return ResponseEntity.ok(ApiResponse.success(null, "All notifications marked as read"));
    }

    @DeleteMapping("/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> deleteNotification(@PathVariable Long notificationId) {
        var notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new com.yavijexpress.exception.ResourceNotFoundException("Notification not found"));

        // Check ownership
        if (!notification.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new com.yavijexpress.exception.UnauthorizedException("Access denied");
        }

        notificationRepository.delete(notification);

        return ResponseEntity.ok(ApiResponse.success(null, "Notification deleted"));
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<?>> deleteAllNotifications() {
        Long userId = SecurityUtils.getCurrentUserId();

        List<com.yavijexpress.entity.Notification> notifications =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        notificationRepository.deleteAll(notifications);

        return ResponseEntity.ok(ApiResponse.success(null, "All notifications deleted"));
    }

    @GetMapping("/test-actions")
    public ResponseEntity<?> testActions() {
        List<Notification> notifications = notificationRepository.findAll();
        return ResponseEntity.ok(notifications.stream().map(n -> 
            "ID: " + n.getId() + ", Actions: " + n.getActions()).toList());
    }
}