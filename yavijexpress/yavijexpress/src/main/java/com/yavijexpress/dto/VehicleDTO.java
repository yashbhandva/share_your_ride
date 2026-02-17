package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class VehicleDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VehicleRequest {
        @NotBlank
        private String vehicleNumber;
        @NotBlank
        private String model;
        @NotBlank
        private String color;
        @NotNull
        @Min(1)
        private Integer totalSeats;
        @NotBlank
        private String insuranceNumber;
        private LocalDateTime insuranceExpiry;
        @NotBlank
        private String vehicleType; // CAR, BIKE, etc.
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class VehicleResponse {
        private Long id;
        private String vehicleNumber;
        private String model;
        private String color;
        private Integer totalSeats;
        private String insuranceNumber;
        private LocalDateTime insuranceExpiry;
        private String vehicleType;
        private Boolean isActive;
        private Long userId;
        private String ownerName;
    }
}