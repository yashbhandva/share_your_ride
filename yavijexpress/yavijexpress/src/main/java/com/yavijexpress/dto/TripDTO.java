package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

public class TripDTO {

    @Data
    public static class TripRequest {
        @NotBlank private String fromLocation;
        @NotBlank private String toLocation;
        @NotNull private LocalDateTime departureTime;
        private LocalDateTime expectedArrivalTime;
        @NotNull @Positive private Double pricePerSeat;
        @NotNull @Min(1) private Integer totalSeats;
        private String routePolyline;
        private Double distanceKm;
        private Boolean isFlexible = false;
        private String notes;
        @NotNull private Long vehicleId;

        public String getFromLocation() {
            return fromLocation;
        }

        public void setFromLocation(String fromLocation) {
            this.fromLocation = fromLocation;
        }

        public String getToLocation() {
            return toLocation;
        }

        public void setToLocation(String toLocation) {
            this.toLocation = toLocation;
        }

        public LocalDateTime getDepartureTime() {
            return departureTime;
        }

        public void setDepartureTime(LocalDateTime departureTime) {
            this.departureTime = departureTime;
        }

        public LocalDateTime getExpectedArrivalTime() {
            return expectedArrivalTime;
        }

        public void setExpectedArrivalTime(LocalDateTime expectedArrivalTime) {
            this.expectedArrivalTime = expectedArrivalTime;
        }

        public Double getPricePerSeat() {
            return pricePerSeat;
        }

        public void setPricePerSeat(Double pricePerSeat) {
            this.pricePerSeat = pricePerSeat;
        }

        public Integer getTotalSeats() {
            return totalSeats;
        }

        public void setTotalSeats(Integer totalSeats) {
            this.totalSeats = totalSeats;
        }

        public String getRoutePolyline() {
            return routePolyline;
        }

        public void setRoutePolyline(String routePolyline) {
            this.routePolyline = routePolyline;
        }

        public Double getDistanceKm() {
            return distanceKm;
        }

        public void setDistanceKm(Double distanceKm) {
            this.distanceKm = distanceKm;
        }

        public Boolean getIsFlexible() {
            return isFlexible;
        }

        public void setIsFlexible(Boolean flexible) {
            isFlexible = flexible;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }

        public Long getVehicleId() {
            return vehicleId;
        }

        public void setVehicleId(Long vehicleId) {
            this.vehicleId = vehicleId;
        }
    }

    @Data
    public static class TripResponse {
        private Long id;
        private String fromLocation;
        private String toLocation;
        private LocalDateTime departureTime;
        private LocalDateTime expectedArrivalTime;
        private Double pricePerSeat;
        private Integer totalSeats;
        private Integer availableSeats;
        private String status;
        private Double distanceKm;
        private String driverName;
        private Long driverId;
        private String vehicleModel;
        private String vehicleNumber;
        private Boolean soberDeclaration;
        private Boolean isActive;
        private String notes;
        private LocalDateTime createdAt;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getFromLocation() {
            return fromLocation;
        }

        public void setFromLocation(String fromLocation) {
            this.fromLocation = fromLocation;
        }

        public String getToLocation() {
            return toLocation;
        }

        public void setToLocation(String toLocation) {
            this.toLocation = toLocation;
        }

        public LocalDateTime getDepartureTime() {
            return departureTime;
        }

        public void setDepartureTime(LocalDateTime departureTime) {
            this.departureTime = departureTime;
        }

        public LocalDateTime getExpectedArrivalTime() {
            return expectedArrivalTime;
        }

        public void setExpectedArrivalTime(LocalDateTime expectedArrivalTime) {
            this.expectedArrivalTime = expectedArrivalTime;
        }

        public Double getPricePerSeat() {
            return pricePerSeat;
        }

        public void setPricePerSeat(Double pricePerSeat) {
            this.pricePerSeat = pricePerSeat;
        }

        public Integer getTotalSeats() {
            return totalSeats;
        }

        public void setTotalSeats(Integer totalSeats) {
            this.totalSeats = totalSeats;
        }

        public Integer getAvailableSeats() {
            return availableSeats;
        }

        public void setAvailableSeats(Integer availableSeats) {
            this.availableSeats = availableSeats;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public Double getDistanceKm() {
            return distanceKm;
        }

        public void setDistanceKm(Double distanceKm) {
            this.distanceKm = distanceKm;
        }

        public String getDriverName() {
            return driverName;
        }

        public void setDriverName(String driverName) {
            this.driverName = driverName;
        }

        public Long getDriverId() {
            return driverId;
        }

        public void setDriverId(Long driverId) {
            this.driverId = driverId;
        }

        public String getVehicleModel() {
            return vehicleModel;
        }

        public void setVehicleModel(String vehicleModel) {
            this.vehicleModel = vehicleModel;
        }

        public String getVehicleNumber() {
            return vehicleNumber;
        }

        public void setVehicleNumber(String vehicleNumber) {
            this.vehicleNumber = vehicleNumber;
        }

        public Boolean getSoberDeclaration() {
            return soberDeclaration;
        }

        public void setSoberDeclaration(Boolean soberDeclaration) {
            this.soberDeclaration = soberDeclaration;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public Boolean getIsActive() {
            return isActive;
        }

        public void setIsActive(Boolean active) {
            isActive = active;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

    @Data
    public static class TripSearchRequest {
        private String fromLocation;
        private String toLocation;
        private LocalDateTime departureDate;
        private Integer requiredSeats = 1;
        private Double maxPrice;

        public String getFromLocation() {
            return fromLocation;
        }

        public void setFromLocation(String fromLocation) {
            this.fromLocation = fromLocation;
        }

        public String getToLocation() {
            return toLocation;
        }

        public void setToLocation(String toLocation) {
            this.toLocation = toLocation;
        }

        public LocalDateTime getDepartureDate() {
            return departureDate;
        }

        public void setDepartureDate(LocalDateTime departureDate) {
            this.departureDate = departureDate;
        }

        public Integer getRequiredSeats() {
            return requiredSeats;
        }

        public void setRequiredSeats(Integer requiredSeats) {
            this.requiredSeats = requiredSeats;
        }

        public Double getMaxPrice() {
            return maxPrice;
        }

        public void setMaxPrice(Double maxPrice) {
            this.maxPrice = maxPrice;
        }
    }

    @Data
    public static class SoberDeclarationRequest {
        @NotNull private Boolean soberDeclaration;
        @NotBlank private String otp; // Sent to driver's mobile

        public Boolean getSoberDeclaration() {
            return soberDeclaration;
        }

        public void setSoberDeclaration(Boolean soberDeclaration) {
            this.soberDeclaration = soberDeclaration;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
}