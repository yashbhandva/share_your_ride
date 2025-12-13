package com.yavijexpress.service.impl;

import com.yavijexpress.dto.AdminDTO;
import com.yavijexpress.entity.User;
import com.yavijexpress.entity.Trip;
import com.yavijexpress.entity.Booking;
import com.yavijexpress.repository.*;
import com.yavijexpress.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final NotificationRepository notificationRepository;
    private final RatingRepository ratingRepository;
    private final EmergencyAlertRepository emergencyAlertRepository;

    public AdminServiceImpl(UserRepository userRepository, TripRepository tripRepository, 
                           BookingRepository bookingRepository, ContactMessageRepository contactMessageRepository,
                           NotificationRepository notificationRepository, RatingRepository ratingRepository,
                           EmergencyAlertRepository emergencyAlertRepository) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.notificationRepository = notificationRepository;
        this.ratingRepository = ratingRepository;
        this.emergencyAlertRepository = emergencyAlertRepository;
    }

    @Override
    public AdminDTO.DashboardStats getDashboardStats() {
        AdminDTO.DashboardStats stats = new AdminDTO.DashboardStats();
        
        stats.setTotalUsers(userRepository.count());
        stats.setTotalTrips(tripRepository.count());
        stats.setActiveDrivers(userRepository.countByRoleAndIsActive(User.UserRole.DRIVER, true));
        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingBookings(bookingRepository.countByStatus(Booking.BookingStatus.PENDING));
        stats.setTotalMessages(contactMessageRepository.count());
        
        // Calculate total revenue from completed bookings
        Double revenue = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
                .mapToDouble(Booking::getTotalAmount)
                .sum();
        stats.setTotalRevenue(revenue);
        
        return stats;
    }

    @Override
    public List<AdminDTO.UserManagement> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable).getContent().stream()
                .map(this::convertToUserManagement)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminDTO.TripManagement> getAllTrips(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Trip> allTrips = tripRepository.findAll(pageable).getContent();
        System.out.println("🔍 DEBUG: Found " + allTrips.size() + " trips on page " + page);
        
        if (!allTrips.isEmpty()) {
            Trip firstTrip = allTrips.get(0);
            System.out.println("🔍 DEBUG: First trip - ID: " + firstTrip.getId() + 
                             ", From: " + firstTrip.getFromLocation() + 
                             ", To: " + firstTrip.getToLocation() + 
                             ", Driver: " + (firstTrip.getDriver() != null ? firstTrip.getDriver().getName() : "NULL"));
        }
        
        return allTrips.stream()
                .map(this::convertToTripManagement)
                .collect(Collectors.toList());
    }

    @Override
    public AdminDTO.UserManagement updateUserStatus(Long userId, Boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(isActive);
        User updatedUser = userRepository.save(user);
        return convertToUserManagement(updatedUser);
    }

    @Override
    public AdminDTO.UserManagement updateUserVerification(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerificationStatus(User.VerificationStatus.valueOf(status.toUpperCase()));
        User updatedUser = userRepository.save(user);
        return convertToUserManagement(updatedUser);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        System.out.println("🔄 DEBUG: Starting cascade deletion for user: " + userId + " (" + user.getName() + ")");
        
        // Delete related entities first to avoid foreign key constraint violations
        
        // Delete user's emergency alerts
        emergencyAlertRepository.deleteByUserId(userId);
        System.out.println("✅ DEBUG: Deleted emergency alerts for user: " + userId);
        
        // Delete user's notifications
        notificationRepository.deleteByUser(user);
        System.out.println("✅ DEBUG: Deleted notifications for user: " + userId);
        
        // Delete user's ratings (both given and received)
        ratingRepository.deleteByGivenBy(user);
        ratingRepository.deleteByGivenTo(user);
        System.out.println("✅ DEBUG: Deleted ratings for user: " + userId);
        
        // Delete user's bookings (if user is a passenger)
        bookingRepository.deleteByPassenger(user);
        System.out.println("✅ DEBUG: Deleted bookings for user: " + userId);
        
        // Delete user's trips (if user is a driver)
        if (user.getRole() == User.UserRole.DRIVER) {
            tripRepository.deleteByDriver(user);
            System.out.println("✅ DEBUG: Deleted trips for driver: " + userId);
        }
        
        // Delete user's vehicles
        user.getVehicles().clear();
        System.out.println("✅ DEBUG: Cleared vehicles for user: " + userId);
        
        // Now delete the user
        userRepository.delete(user);
        System.out.println("✅ DEBUG: Successfully deleted user: " + userId);
    }

    @Override
    public void deleteTrip(Long tripId) {
        tripRepository.deleteById(tripId);
    }

    private AdminDTO.UserManagement convertToUserManagement(User user) {
        AdminDTO.UserManagement dto = new AdminDTO.UserManagement();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setMobile(user.getMobile());
        dto.setRole(user.getRole().toString());
        dto.setVerificationStatus(user.getVerificationStatus().toString());
        dto.setIsActive(user.getIsActive());
        dto.setAvgRating(user.getAvgRating());
        dto.setTotalRides(user.getTotalRides());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    private AdminDTO.TripManagement convertToTripManagement(Trip trip) {
        AdminDTO.TripManagement dto = new AdminDTO.TripManagement();
        dto.setId(trip.getId());
        dto.setFromLocation(trip.getFromLocation());
        dto.setToLocation(trip.getToLocation());
        dto.setDepartureTime(trip.getDepartureTime());
        dto.setPricePerSeat(trip.getPricePerSeat());
        dto.setTotalSeats(trip.getTotalSeats());
        dto.setAvailableSeats(trip.getAvailableSeats());
        dto.setStatus(trip.getStatus().toString());
        dto.setIsActive(trip.getIsActive());
        dto.setDriverName(trip.getDriver().getName());
        dto.setDriverEmail(trip.getDriver().getEmail());
        dto.setCreatedAt(trip.getCreatedAt());
        return dto;
    }
}