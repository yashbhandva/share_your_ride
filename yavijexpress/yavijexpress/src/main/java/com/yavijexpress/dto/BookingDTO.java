package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

public class BookingDTO {

    @Data
    public static class BookingRequest {
        @NotNull private Long tripId;
        @NotNull @Min(1) private Integer seats;
        private String specialRequests;

        public Long getTripId() {
            return tripId;
        }

        public void setTripId(Long tripId) {
            this.tripId = tripId;
        }

        public Integer getSeats() {
            return seats;
        }

        public void setSeats(Integer seats) {
            this.seats = seats;
        }

        public String getSpecialRequests() {
            return specialRequests;
        }

        public void setSpecialRequests(String specialRequests) {
            this.specialRequests = specialRequests;
        }
    }

    @Data
    public static class BookingResponse {
        private Long id;
        private Integer seatsBooked;
        private Double totalAmount;
        private String status;
        private String passengerName;
        private Long passengerId;
        private String tripFrom;
        private String tripTo;
        private LocalDateTime departureTime;
        private String paymentStatus;
        private String specialRequests;
        private String tripNotes;
        private String pickupOtp;
        private String driverName;
        private String driverPhone;
        private String vehicleModel;
        private String vehicleNumber;
        private LocalDateTime bookedAt;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Integer getSeatsBooked() {
            return seatsBooked;
        }

        public void setSeatsBooked(Integer seatsBooked) {
            this.seatsBooked = seatsBooked;
        }

        public Double getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(Double totalAmount) {
            this.totalAmount = totalAmount;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getPassengerName() {
            return passengerName;
        }

        public void setPassengerName(String passengerName) {
            this.passengerName = passengerName;
        }

        public Long getPassengerId() {
            return passengerId;
        }

        public void setPassengerId(Long passengerId) {
            this.passengerId = passengerId;
        }

        public String getTripFrom() {
            return tripFrom;
        }

        public void setTripFrom(String tripFrom) {
            this.tripFrom = tripFrom;
        }

        public String getTripTo() {
            return tripTo;
        }

        public void setTripTo(String tripTo) {
            this.tripTo = tripTo;
        }

        public LocalDateTime getDepartureTime() {
            return departureTime;
        }

        public void setDepartureTime(LocalDateTime departureTime) {
            this.departureTime = departureTime;
        }

        public String getPaymentStatus() {
            return paymentStatus;
        }

        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
        }

        public LocalDateTime getBookedAt() {
            return bookedAt;
        }

        public void setBookedAt(LocalDateTime bookedAt) {
            this.bookedAt = bookedAt;
        }

        public String getSpecialRequests() {
            return specialRequests;
        }

        public void setSpecialRequests(String specialRequests) {
            this.specialRequests = specialRequests;
        }

        public String getTripNotes() {
            return tripNotes;
        }

        public void setTripNotes(String tripNotes) {
            this.tripNotes = tripNotes;
        }

        public String getPickupOtp() {
            return pickupOtp;
        }

        public void setPickupOtp(String pickupOtp) {
            this.pickupOtp = pickupOtp;
        }

        public String getDriverName() {
            return driverName;
        }

        public void setDriverName(String driverName) {
            this.driverName = driverName;
        }

        public String getDriverPhone() {
            return driverPhone;
        }

        public void setDriverPhone(String driverPhone) {
            this.driverPhone = driverPhone;
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
    }

    @Data
    public static class BookingStatusUpdateRequest {
        @NotBlank private String status; // CONFIRMED, CANCELLED
        private String reason;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    @Data
    public static class OtpVerificationRequest {
        @NotNull private Long bookingId;
        @NotBlank private String otp;

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
}