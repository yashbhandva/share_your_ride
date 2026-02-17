package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class TripDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TripRequest {
        @NotBlank
        private String fromLocation;
        @NotBlank
        private String toLocation;
        @NotNull
        private LocalDateTime departureTime;
        private LocalDateTime expectedArrivalTime;
        @NotNull
        @Positive
        private Double pricePerSeat;
        @NotNull
        @Min(1)
        private Integer totalSeats;
        private String routePolyline;
        private Double distanceKm;
        private Boolean isFlexible = false;
        private String notes;
        @NotNull
        private Long vehicleId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
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
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TripSearchRequest {
        private String fromLocation;
        private String toLocation;
        private LocalDateTime departureDate;
        private Integer requiredSeats = 1;
        private Double maxPrice;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SoberDeclarationRequest {
        @NotNull private Boolean soberDeclaration;
        @NotBlank private String otp; // Sent to driver's mobile
    }
}