package com.yavijexpress.service;

import com.yavijexpress.entity.*;

public interface NotificationService {
    void sendTripCreatedNotification(Trip trip);
    void sendTripUpdatedNotification(Trip trip);
    void sendTripCancelledNotification(Trip trip, String reason);
    void sendTripStartedNotification(Trip trip);
    void sendTripCompletedNotification(Trip trip);
    void sendBookingRequestNotification(Booking booking);
    void sendBookingConfirmedNotification(Booking booking);
    void sendBookingCancelledNotification(Booking booking, String reason);
    void sendPaymentSuccessNotification(Payment payment);
    void sendComplaintSubmittedNotification(Complaint complaint);
    void sendComplaintStatusUpdateNotification(Complaint complaint);
    void sendComplaintEscalationNotification(Complaint complaint, String reason);
    void sendEmergencyNotification(User user, String title, String message, Long alertId);
    void sendAdminNotification(User admin, String title, String message, String entityType, Long entityId);
}