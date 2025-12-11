package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

public class VehicleDTO {

    @Data
    public static class VehicleRequest {
        @NotBlank private String vehicleNumber;
        @NotBlank private String model;
        @NotBlank private String color;
        @NotNull @Min(1) private Integer totalSeats;
        @NotBlank private String insuranceNumber;
        private LocalDateTime insuranceExpiry;
        @NotBlank private String vehicleType; // CAR, BIKE, etc.

        public String getVehicleNumber() {
            return vehicleNumber;
        }

        public void setVehicleNumber(String vehicleNumber) {
            this.vehicleNumber = vehicleNumber;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public Integer getTotalSeats() {
            return totalSeats;
        }

        public void setTotalSeats(Integer totalSeats) {
            this.totalSeats = totalSeats;
        }

        public String getInsuranceNumber() {
            return insuranceNumber;
        }

        public void setInsuranceNumber(String insuranceNumber) {
            this.insuranceNumber = insuranceNumber;
        }

        public LocalDateTime getInsuranceExpiry() {
            return insuranceExpiry;
        }

        public void setInsuranceExpiry(LocalDateTime insuranceExpiry) {
            this.insuranceExpiry = insuranceExpiry;
        }

        public String getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(String vehicleType) {
            this.vehicleType = vehicleType;
        }
    }

    @Data
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

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getVehicleNumber() {
            return vehicleNumber;
        }

        public void setVehicleNumber(String vehicleNumber) {
            this.vehicleNumber = vehicleNumber;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public Integer getTotalSeats() {
            return totalSeats;
        }

        public void setTotalSeats(Integer totalSeats) {
            this.totalSeats = totalSeats;
        }

        public String getInsuranceNumber() {
            return insuranceNumber;
        }

        public void setInsuranceNumber(String insuranceNumber) {
            this.insuranceNumber = insuranceNumber;
        }

        public LocalDateTime getInsuranceExpiry() {
            return insuranceExpiry;
        }

        public void setInsuranceExpiry(LocalDateTime insuranceExpiry) {
            this.insuranceExpiry = insuranceExpiry;
        }

        public String getVehicleType() {
            return vehicleType;
        }

        public void setVehicleType(String vehicleType) {
            this.vehicleType = vehicleType;
        }

        public Boolean getActive() {
            return isActive;
        }

        public void setActive(Boolean active) {
            isActive = active;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getOwnerName() {
            return ownerName;
        }

        public void setOwnerName(String ownerName) {
            this.ownerName = ownerName;
        }
    }
}