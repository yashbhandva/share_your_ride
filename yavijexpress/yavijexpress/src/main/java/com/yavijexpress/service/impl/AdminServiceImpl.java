package com.yavijexpress.service.impl;

import com.yavijexpress.dto.AdminDTO;
import com.yavijexpress.entity.User;
import com.yavijexpress.entity.Trip;
import com.yavijexpress.entity.Booking;
import com.yavijexpress.repository.*;
import com.yavijexpress.service.AdminService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;

    public AdminServiceImpl(UserRepository userRepository, TripRepository tripRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public AdminDTO.DashboardStats getDashboardStats() {
        AdminDTO.DashboardStats stats = new AdminDTO.DashboardStats();
        
        stats.setTotalUsers(userRepository.count());
        stats.setTotalTrips(tripRepository.count());
        stats.setActiveDrivers(userRepository.countByRoleAndIsActive(User.UserRole.DRIVER, true));
        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingBookings(bookingRepository.countByStatus(Booking.BookingStatus.PENDING));
        
        // Calculate total revenue from completed bookings
        Double revenue = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
                .mapToDouble(Booking::getTotalAmount)
                .sum();
        stats.setTotalRevenue(revenue);
        
        return stats;
    }

    @Override
    public List<AdminDTO.UserManagement> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserManagement)
                .collect(Collectors.toList());
    }

    @Override
    public List<AdminDTO.TripManagement> getAllTrips() {
        List<Trip> allTrips = tripRepository.findAll();
        System.out.println("🔍 DEBUG: Found " + allTrips.size() + " trips in database");
        
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
        userRepository.deleteById(userId);
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