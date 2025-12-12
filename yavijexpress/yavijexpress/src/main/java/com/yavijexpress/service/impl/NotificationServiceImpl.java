package com.yavijexpress.service.impl;

import com.yavijexpress.entity.*;
import com.yavijexpress.repository.NotificationRepository;
import com.yavijexpress.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendTripCreatedNotification(Trip trip) {
        // This would be sent to nearby passengers (not implemented here)
        // In production, we would have a separate service for location-based notifications
    }

    @Override
    public void sendTripUpdatedNotification(Trip trip) {
        // Notify all passengers who booked this trip
        trip.getBookings().forEach(booking -> {
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                Notification notification = createNotification(
                        booking.getPassenger(),
                        "Trip Updated",
                        String.format("Your trip from %s to %s has been updated",
                                trip.getFromLocation(), trip.getToLocation()),
                        Notification.NotificationType.INFO,
                        "TRIP",
                        trip.getId()
                );
                notificationRepository.save(notification);
            }
        });
    }

    @Override
    public void sendTripCancelledNotification(Trip trip, String reason) {
        trip.getBookings().forEach(booking -> {
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                Notification notification = createNotification(
                        booking.getPassenger(),
                        "Trip Cancelled",
                        String.format("Your trip from %s to %s has been cancelled. Reason: %s",
                                trip.getFromLocation(), trip.getToLocation(), reason),
                        Notification.NotificationType.ERROR,
                        "TRIP",
                        trip.getId()
                );
                notificationRepository.save(notification);
            }
        });
    }

    @Override
    public void sendTripStartedNotification(Trip trip) {
        trip.getBookings().forEach(booking -> {
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                Notification notification = createNotification(
                        booking.getPassenger(),
                        "Trip Started",
                        "Your ride has started. The driver is on the way.",
                        Notification.NotificationType.INFO,
                        "TRIP",
                        trip.getId()
                );
                notificationRepository.save(notification);
            }
        });
    }

    @Override
    public void sendTripCompletedNotification(Trip trip) {
        // Notify driver
        Notification driverNotification = createNotification(
                trip.getDriver(),
                "Trip Completed",
                String.format("Your trip from %s to %s has been completed successfully",
                        trip.getFromLocation(), trip.getToLocation()),
                Notification.NotificationType.SUCCESS,
                "TRIP",
                trip.getId()
        );
        notificationRepository.save(driverNotification);

        // Notify passengers
        trip.getBookings().forEach(booking -> {
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                Notification passengerNotification = createNotification(
                        booking.getPassenger(),
                        "Trip Completed",
                        "Your ride has been completed. Please rate your experience.",
                        Notification.NotificationType.SUCCESS,
                        "TRIP",
                        trip.getId()
                );
                notificationRepository.save(passengerNotification);
            }
        });
    }

    @Override
    public void sendBookingRequestNotification(Booking booking) {
        String message = String.format(
            "New Booking Request - Status: Pending Approval\n" +
            "Passenger: %s\n" +
            "Trip: %s to %s\n" +
            "Departure: %s\n" +
            "Seats: %d\n" +
            "Amount: ₹%.2f",
            booking.getPassenger().getName(),
            booking.getTrip().getFromLocation(),
            booking.getTrip().getToLocation(),
            booking.getTrip().getDepartureTime(),
            booking.getSeatsBooked(),
            booking.getTotalAmount()
        );
        
        Notification notification = createNotification(
                booking.getTrip().getDriver(),
                "New Booking Request",
                message,
                Notification.NotificationType.INFO,
                "BOOKING",
                booking.getId()
        );
        
        String actions = String.format(
            "[{\"label\":\"Accept\",\"action\":\"confirm\",\"url\":\"/api/bookings/%d/confirm\",\"style\":\"success\"}," +
            "{\"label\":\"Deny\",\"action\":\"deny\",\"url\":\"/api/bookings/%d/deny\",\"style\":\"danger\"}]",
            booking.getId(), booking.getId()
        );
        notification.setActions(actions);
        
        Notification saved = notificationRepository.save(notification);
        sendRealTimeNotification(booking.getTrip().getDriver().getId(), saved);
    }

    @Override
    public void sendBookingConfirmedNotification(Booking booking) {
        Trip trip = booking.getTrip();
        User driver = trip.getDriver();
        
        String message = String.format(
            "Your trip is booked successfully!\n\n" +
            "Driver Details:\n" +
            "Name: %s\n" +
            "Phone: %s\n" +
            "Vehicle: %s (%s)\n\n" +
            "Trip Details:\n" +
            "From: %s\n" +
            "To: %s\n" +
            "Departure: %s\n\n" +
            "Pickup OTP: %s\n" +
            "Please give this OTP to the driver during pickup.",
            driver.getName(),
            driver.getMobile(),
            trip.getVehicle().getModel(),
            trip.getVehicle().getVehicleNumber(),
            trip.getFromLocation(),
            trip.getToLocation(),
            trip.getDepartureTime(),
            booking.getPickupOtp()
        );
        
        Notification notification = createNotification(
                booking.getPassenger(),
                "Trip Booked Successfully",
                message,
                Notification.NotificationType.SUCCESS,
                "BOOKING",
                booking.getId()
        );
        Notification saved = notificationRepository.save(notification);
        sendRealTimeNotification(booking.getPassenger().getId(), saved);
    }

    @Override
    public void sendBookingDeniedNotification(Booking booking) {
        Notification notification = createNotification(
                booking.getPassenger(),
                "Trip Request Denied",
                "Your trip request was denied by the driver.",
                Notification.NotificationType.WARNING,
                "BOOKING",
                booking.getId()
        );
        Notification saved = notificationRepository.save(notification);
        sendRealTimeNotification(booking.getPassenger().getId(), saved);
    }

    @Override
    public void sendBookingCancelledNotification(Booking booking, String reason) {
        // Notify passenger
        Notification passengerNotification = createNotification(
                booking.getPassenger(),
                "Booking Cancelled",
                String.format("Your booking has been cancelled. Reason: %s", reason),
                Notification.NotificationType.WARNING,
                "BOOKING",
                booking.getId()
        );
        notificationRepository.save(passengerNotification);

        // Notify driver
        Notification driverNotification = createNotification(
                booking.getTrip().getDriver(),
                "Booking Cancelled",
                String.format("A booking has been cancelled by %s. Reason: %s",
                        booking.getPassenger().getName(), reason),
                Notification.NotificationType.WARNING,
                "BOOKING",
                booking.getId()
        );
        notificationRepository.save(driverNotification);
    }

    @Override
    public void sendPaymentSuccessNotification(Payment payment) {
        Notification notification = createNotification(
                payment.getBooking().getPassenger(),
                "Payment Successful",
                String.format("Payment of ₹%.2f for booking #%d was successful",
                        payment.getAmount(), payment.getBooking().getId()),
                Notification.NotificationType.SUCCESS,
                "PAYMENT",
                payment.getId()
        );
        notificationRepository.save(notification);
    }

    @Override
    public void sendComplaintSubmittedNotification(Complaint complaint) {
        Notification notification = createNotification(
                complaint.getReportedBy(),
                "Complaint Submitted",
                String.format("Your complaint '%s' has been submitted successfully. We'll review it soon.",
                        complaint.getTitle()),
                Notification.NotificationType.INFO,
                "COMPLAINT",
                complaint.getId()
        );
        notificationRepository.save(notification);
    }

    @Override
    public void sendComplaintStatusUpdateNotification(Complaint complaint) {
        Notification notification = createNotification(
                complaint.getReportedBy(),
                "Complaint Status Updated",
                String.format("Your complaint '%s' status has been updated to: %s",
                        complaint.getTitle(), complaint.getStatus()),
                Notification.NotificationType.INFO,
                "COMPLAINT",
                complaint.getId()
        );
        notificationRepository.save(notification);
    }

    @Override
    public void sendComplaintEscalationNotification(Complaint complaint, String reason) {
        // This would be sent to higher authorities (not implemented in detail)
    }

    @Override
    public void sendEmergencyNotification(User user, String title, String message, Long alertId) {
        Notification notification = createNotification(
                user,
                title,
                message,
                Notification.NotificationType.EMERGENCY_ALERT,
                "EMERGENCY",
                alertId
        );
        notificationRepository.save(notification);
    }

    @Override
    public void sendAdminNotification(User admin, String title, String message, String entityType, Long entityId) {
        Notification notification = createNotification(
                admin,
                title,
                message,
                Notification.NotificationType.WARNING,
                entityType,
                entityId
        );
        notificationRepository.save(notification);
    }

    private Notification createNotification(User user, String title, String message,
                                            Notification.NotificationType type,
                                            String entityType, Long entityId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedEntityType(entityType);
        notification.setRelatedEntityId(entityId);
        notification.setIsRead(false);

        return notification;
    }

    private void sendRealTimeNotification(Long userId, Notification notification) {
        try {
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("title", notification.getTitle());
            notificationData.put("message", notification.getMessage());
            notificationData.put("type", notification.getType().toString());
            notificationData.put("entityType", notification.getRelatedEntityType());
            notificationData.put("entityId", notification.getRelatedEntityId());
            notificationData.put("actions", notification.getActions());
            notificationData.put("timestamp", LocalDateTime.now());
            
            messagingTemplate.convertAndSend("/topic/notifications/" + userId, notificationData);
        } catch (Exception e) {
            // Log error but don't fail notification creation
        }
    }

}