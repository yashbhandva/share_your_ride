package com.yavijexpress.utils;

import com.yavijexpress.entity.*;
import com.yavijexpress.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service

public class NotificationService {


    @Autowired
    private  NotificationRepository notificationRepository;

    public void sendTripCreatedNotification(Trip trip) {
        // Send to nearby passengers
        Notification notification = new Notification();
        notification.setTitle("New Trip Available!");
        notification.setMessage(String.format(
                "New trip from %s to %s at %s",
                trip.getFromLocation(),
                trip.getToLocation(),
                trip.getDepartureTime()
        ));
        notification.setType(Notification.NotificationType.INFO);
        // Save for relevant users
    }

    public void sendBookingRequestNotification(Booking booking) {
        Notification notification = new Notification();
        notification.setUser(booking.getTrip().getDriver());
        notification.setTitle("New Booking Request");
        notification.setMessage(String.format(
                "%s has requested %d seat(s) on your trip",
                booking.getPassenger().getName(),
                booking.getSeatsBooked()
        ));
        notification.setType(Notification.NotificationType.INFO);
        notification.setRelatedEntityType("BOOKING");
        notification.setRelatedEntityId(booking.getId());
        notificationRepository.save(notification);
    }

    public void sendBookingConfirmedNotification(Booking booking) {
        Notification notification = new Notification();
        notification.setUser(booking.getPassenger());
        notification.setTitle("Booking Confirmed!");
        notification.setMessage(String.format(
                "Your booking for trip from %s to %s has been confirmed",
                booking.getTrip().getFromLocation(),
                booking.getTrip().getToLocation()
        ));
        notification.setType(Notification.NotificationType.SUCCESS);
        notification.setRelatedEntityType("BOOKING");
        notification.setRelatedEntityId(booking.getId());
        notificationRepository.save(notification);
    }

    public void sendTripStartedNotification(Trip trip) {
        // Send to all passengers
        trip.getBookings().forEach(booking -> {
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                Notification notification = new Notification();
                notification.setUser(booking.getPassenger());
                notification.setTitle("Trip Started");
                notification.setMessage("Your ride has started. Driver is on the way.");
                notification.setType(Notification.NotificationType.INFO);
                notificationRepository.save(notification);
            }
        });
    }
}