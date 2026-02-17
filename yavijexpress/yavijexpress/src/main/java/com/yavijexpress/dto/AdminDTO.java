package com.yavijexpress.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class AdminDTO {
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DashboardStats {
        private Long totalUsers;
        private Long totalTrips;
        private Double totalRevenue;
        private Long activeDrivers;
        private Long totalBookings;
        private Long pendingBookings;
        private Long totalMessages;
}

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserManagement {
        private Long id;
        private String name;
        private String email;
        private String mobile;
        private String role;
        private String verificationStatus;
        private Boolean isActive;
        private Double avgRating;
        private Integer totalRides;
        private LocalDateTime createdAt;
}

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TripManagement {
        private Long id;
        private String fromLocation;
        private String toLocation;
        private LocalDateTime departureTime;
        private Double pricePerSeat;
        private Integer totalSeats;
        private Integer availableSeats;
        private String status;
        private Boolean isActive;
        private String driverName;
        private String driverEmail;
        private LocalDateTime createdAt;
    }
}