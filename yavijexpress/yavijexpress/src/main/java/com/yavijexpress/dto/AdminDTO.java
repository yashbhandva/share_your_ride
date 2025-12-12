package com.yavijexpress.dto;

import java.time.LocalDateTime;

public class AdminDTO {

    public static class DashboardStats {
        private Long totalUsers;
        private Long totalTrips;
        private Double totalRevenue;
        private Long activeDrivers;
        private Long totalBookings;
        private Long pendingBookings;
        private Long totalMessages;

        public Long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
        public Long getTotalTrips() { return totalTrips; }
        public void setTotalTrips(Long totalTrips) { this.totalTrips = totalTrips; }
        public Double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
        public Long getActiveDrivers() { return activeDrivers; }
        public void setActiveDrivers(Long activeDrivers) { this.activeDrivers = activeDrivers; }
        public Long getTotalBookings() { return totalBookings; }
        public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }
        public Long getPendingBookings() { return pendingBookings; }
        public void setPendingBookings(Long pendingBookings) { this.pendingBookings = pendingBookings; }
        public Long getTotalMessages() { return totalMessages; }
        public void setTotalMessages(Long totalMessages) { this.totalMessages = totalMessages; }
    }

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

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getVerificationStatus() { return verificationStatus; }
        public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
        public Double getAvgRating() { return avgRating; }
        public void setAvgRating(Double avgRating) { this.avgRating = avgRating; }
        public Integer getTotalRides() { return totalRides; }
        public void setTotalRides(Integer totalRides) { this.totalRides = totalRides; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

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

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFromLocation() { return fromLocation; }
        public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }
        public String getToLocation() { return toLocation; }
        public void setToLocation(String toLocation) { this.toLocation = toLocation; }
        public LocalDateTime getDepartureTime() { return departureTime; }
        public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }
        public Double getPricePerSeat() { return pricePerSeat; }
        public void setPricePerSeat(Double pricePerSeat) { this.pricePerSeat = pricePerSeat; }
        public Integer getTotalSeats() { return totalSeats; }
        public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
        public Integer getAvailableSeats() { return availableSeats; }
        public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
        public String getDriverName() { return driverName; }
        public void setDriverName(String driverName) { this.driverName = driverName; }
        public String getDriverEmail() { return driverEmail; }
        public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}