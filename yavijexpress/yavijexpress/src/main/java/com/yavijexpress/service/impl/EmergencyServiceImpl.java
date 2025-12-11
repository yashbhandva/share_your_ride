package com.yavijexpress.service.impl;

import com.yavijexpress.dto.EmergencyDTO;
import com.yavijexpress.entity.*;
import com.yavijexpress.exception.*;
import com.yavijexpress.repository.*;
import com.yavijexpress.service.EmergencyService;
import com.yavijexpress.service.NotificationService;
import com.yavijexpress.service.UserService;
import com.yavijexpress.utils.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class EmergencyServiceImpl implements EmergencyService {

    private final TripRepository tripRepository;
    private final UserService userService;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final SMSServiceImpl smsService;
    private final EmailServiceImpl emailService;
    private final EmergencyAlertRepository emergencyAlertRepository;
    private final LiveLocationRepository liveLocationRepository;

    public EmergencyServiceImpl(TripRepository tripRepository, UserService userService, BookingRepository bookingRepository, NotificationService notificationService, SMSServiceImpl smsService, EmailServiceImpl emailService, EmergencyAlertRepository emergencyAlertRepository, LiveLocationRepository liveLocationRepository) {
        this.tripRepository = tripRepository;
        this.userService = userService;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        this.smsService = smsService;
        this.emailService = emailService;
        this.emergencyAlertRepository = emergencyAlertRepository;
        this.liveLocationRepository = liveLocationRepository;
    }

    @Override
    public EmergencyDTO.EmergencyAlertResponse sendSOS(EmergencyDTO.SOSRequest request) {
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        // Get user from context (in real app, from SecurityContext)
        // For now, let's assume passenger is sending SOS
        List<Booking> bookings = bookingRepository.findByTripId(trip.getId());

        if (bookings.isEmpty()) {
            throw new BadRequestException("No passengers found for this trip");
        }

        // Create emergency alert
        EmergencyAlert alert = new EmergencyAlert();
        alert.setTrip(trip);
        alert.setUserId(bookings.get(0).getPassenger().getId()); // First passenger as trigger
        alert.setAlertType(EmergencyAlert.AlertType.SOS);
        alert.setMessage(request.getMessage());
        alert.setLatitude(request.getLatitude());
        alert.setLongitude(request.getLongitude());
        alert.setStatus(EmergencyAlert.AlertStatus.ACTIVE);
        alert.setCreatedAt(LocalDateTime.now());

        EmergencyAlert savedAlert = emergencyAlertRepository.save(alert);

        // 1. Notify Driver
        User driver = trip.getDriver();
        sendEmergencyNotification(driver, "SOS Alert!",
                "Passenger has triggered SOS in trip #" + trip.getId(), savedAlert.getId());

        // 2. Notify All Passengers in the trip
        bookings.forEach(booking -> {
            User passenger = booking.getPassenger();
            if (!passenger.getId().equals(savedAlert.getUserId())) { // Don't notify the one who triggered
                sendEmergencyNotification(passenger, "SOS Alert in your trip!",
                        "An SOS has been triggered in your ongoing trip", savedAlert.getId());
            }
        });

        // 3. Notify Emergency Contacts of all passengers
        bookings.forEach(booking -> {
            User passenger = booking.getPassenger();
            notifyEmergencyContacts(passenger, trip, savedAlert);
        });

        // 4. Notify Platform Admin
        notifyAdminAboutSOS(trip, savedAlert);

        // 5. Send SMS to emergency contacts
        sendEmergencySMS(trip, savedAlert);

        // 6. Store live location if provided
        if (request.getLatitude() != null && request.getLongitude() != null) {
            updateLiveLocation(request.getTripId(), request.getLatitude(), request.getLongitude(), savedAlert.getUserId());
        }

        // Prepare response
        EmergencyDTO.EmergencyAlertResponse response = new EmergencyDTO.EmergencyAlertResponse();
        response.setAlertId(savedAlert.getId());
        response.setStatus("SOS_SENT");
        response.setMessage("Emergency alert sent to all contacts and authorities");
        response.setSentAt(savedAlert.getCreatedAt());
        response.setAuthoritiesNotified(true);

        return response;
    }

    @Override
    public void updateLiveLocation(EmergencyDTO.LiveLocationRequest request) {
        updateLiveLocation(request.getTripId(), request.getLatitude(), request.getLongitude(), null);
    }

    @Override
    public List<Map<String, String>> getEmergencyContacts(Long userId) {
        User user = userService.getUserById(userId);

        List<Map<String, String>> contacts = new ArrayList<>();

        if (user.getEmergencyContact1() != null && !user.getEmergencyContact1().isEmpty()) {
            contacts.add(createContactMap("Primary", user.getEmergencyContact1()));
        }

        if (user.getEmergencyContact2() != null && !user.getEmergencyContact2().isEmpty()) {
            contacts.add(createContactMap("Secondary", user.getEmergencyContact2()));
        }

        // Add platform emergency helpline
        contacts.add(createContactMap("YaVij Helpline", "+91-1800-XXX-XXXX"));
        contacts.add(createContactMap("Police", "100"));
        contacts.add(createContactMap("Ambulance", "102"));

        return contacts;
    }

    @Override
    public void resolveEmergency(Long alertId, String resolutionNotes) {
        EmergencyAlert alert = emergencyAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency alert not found"));

        alert.setStatus(EmergencyAlert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        alert.setResolutionNotes(resolutionNotes);

        emergencyAlertRepository.save(alert);

        // Notify all involved parties
        notifyEmergencyResolved(alert);
    }

    @Override
    public List<EmergencyAlert> getActiveEmergencies() {
        return emergencyAlertRepository.findByStatus(EmergencyAlert.AlertStatus.ACTIVE);
    }

    @Override
    public void sendDriverPanicAlert(Long tripId, Long driverId, String reason) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        EmergencyAlert alert = new EmergencyAlert();
        alert.setTrip(trip);
        alert.setUserId(driverId);
        alert.setAlertType(EmergencyAlert.AlertType.DRIVER_PANIC);
        alert.setMessage("Driver panic alert: " + reason);
        alert.setStatus(EmergencyAlert.AlertStatus.ACTIVE);
        alert.setCreatedAt(LocalDateTime.now());

        EmergencyAlert savedAlert = emergencyAlertRepository.save(alert);

        // Notify admin immediately
        notifyAdminAboutDriverPanic(trip, savedAlert, reason);

        // Notify all passengers in the trip
        List<Booking> bookings = bookingRepository.findByTripId(tripId);
        bookings.forEach(booking -> {
            User passenger = booking.getPassenger();
            sendEmergencyNotification(passenger, "Driver Alert",
                    "Driver has reported an issue. Please stay calm.", savedAlert.getId());
        });
    }

    private void updateLiveLocation(Long tripId, Double latitude, Double longitude, Long userId) {
        LiveLocation liveLocation = new LiveLocation();
        liveLocation.setTripId(tripId);
        liveLocation.setUserId(userId);
        liveLocation.setLatitude(latitude);
        liveLocation.setLongitude(longitude);
        liveLocation.setUpdatedAt(LocalDateTime.now());

        liveLocationRepository.save(liveLocation);

        // Keep only last 10 locations per trip to avoid DB bloat
        List<LiveLocation> oldLocations = liveLocationRepository
                .findByTripIdOrderByUpdatedAtDesc(tripId);

        if (oldLocations.size() > 10) {
            List<LiveLocation> toDelete = oldLocations.subList(10, oldLocations.size());
            liveLocationRepository.deleteAll(toDelete);
        }
    }

    private void sendEmergencyNotification(User user, String title, String message, Long alertId) {
        notificationService.sendEmergencyNotification(user, title, message, alertId);
    }

    private void notifyEmergencyContacts(User user, Trip trip, EmergencyAlert alert) {
        String message = String.format(
                "EMERGENCY ALERT! %s has triggered SOS in YaVij Express trip from %s to %s. " +
                        "Trip ID: %d, Time: %s, Location: https://maps.google.com/?q=%f,%f",
                user.getName(),
                trip.getFromLocation(),
                trip.getToLocation(),
                trip.getId(),
                LocalDateTime.now(),
                alert.getLatitude(),
                alert.getLongitude()
        );

        // Send to primary contact
        if (user.getEmergencyContact1() != null) {
            smsService.sendSMS(user.getEmergencyContact1(), message);
        }

        // Send to secondary contact
        if (user.getEmergencyContact2() != null) {
            smsService.sendSMS(user.getEmergencyContact2(), message);
        }
    }

    private void notifyAdminAboutSOS(Trip trip, EmergencyAlert alert) {
        // Get all admin users
        List<User> admins = userService.getAllUsers("ADMIN").stream()
                .map(dto -> userService.getUserById(dto.getId()))
                .toList();

        String adminMessage = String.format(
                "🚨 CRITICAL: SOS Alert! Trip #%d from %s to %s. " +
                        "Driver: %s, Vehicle: %s. " +
                        "Location: %f, %f. Time: %s",
                trip.getId(),
                trip.getFromLocation(),
                trip.getToLocation(),
                trip.getDriver().getName(),
                trip.getVehicle().getVehicleNumber(),
                alert.getLatitude(),
                alert.getLongitude(),
                LocalDateTime.now()
        );

        admins.forEach(admin -> {
            sendEmergencyNotification(admin, "SOS ALERT - Requires Immediate Action!", adminMessage, alert.getId());
            emailService.sendEmergencyEmail(admin.getEmail(), "SOS Alert - Trip #" + trip.getId(), adminMessage);
        });
    }

    private void notifyAdminAboutDriverPanic(Trip trip, EmergencyAlert alert, String reason) {
        List<User> admins = userService.getAllUsers("ADMIN").stream()
                .map(dto -> userService.getUserById(dto.getId()))
                .toList();

        String adminMessage = String.format(
                "🚨 DRIVER PANIC: Trip #%d from %s to %s. " +
                        "Driver: %s, Vehicle: %s. " +
                        "Reason: %s. Time: %s",
                trip.getId(),
                trip.getFromLocation(),
                trip.getToLocation(),
                trip.getDriver().getName(),
                trip.getVehicle().getVehicleNumber(),
                reason,
                LocalDateTime.now()
        );

        admins.forEach(admin -> {
            sendEmergencyNotification(admin, "Driver Panic Alert!", adminMessage, alert.getId());
        });
    }

    private void sendEmergencySMS(Trip trip, EmergencyAlert alert) {
        // Send SMS to platform emergency response team
        String smsMessage = String.format(
                "YaVij SOS: Trip#%d, %s to %s, %s, %f,%f, %s",
                trip.getId(),
                trip.getFromLocation(),
                trip.getToLocation(),
                trip.getDriver().getName(),
                alert.getLatitude(),
                alert.getLongitude(),
                LocalDateTime.now()
        );

        // Platform emergency numbers
        String[] emergencyNumbers = {"+91-XXXXXXXXXX", "+91-XXXXXXXXXX"};
        for (String number : emergencyNumbers) {
            smsService.sendSMS(number, smsMessage);
        }
    }

    private void notifyEmergencyResolved(EmergencyAlert alert) {
        Trip trip = alert.getTrip();

        // Notify driver
        sendEmergencyNotification(trip.getDriver(), "Emergency Resolved",
                "The emergency alert has been resolved by platform admin.", alert.getId());

        // Notify all passengers
        List<Booking> bookings = bookingRepository.findByTripId(trip.getId());
        bookings.forEach(booking -> {
            sendEmergencyNotification(booking.getPassenger(), "Emergency Resolved",
                    "The emergency situation has been resolved. Thank you for your cooperation.", alert.getId());
        });

        // Notify admin who resolved it
        // This would come from SecurityContext in real implementation
    }

    private Map<String, String> createContactMap(String type, String number) {
        Map<String, String> contact = new HashMap<>();
        contact.put("type", type);
        contact.put("number", number);
        return contact;
    }
}