package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class BookingDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BookingRequest {
        @NotNull private Long tripId;
        @NotNull @Min(1) private Integer seats;
        private String specialRequests;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
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
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BookingStatusUpdateRequest {
        @NotBlank private String status; // CONFIRMED, CANCELLED
        private String reason;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OtpVerificationRequest {
        @NotNull private Long bookingId;
        @NotBlank private String otp;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BookingActionResponse {
        private Long bookingId;
        private String status;
        private String message;
        private String otp;
        private boolean success;

        public BookingActionResponse(Long bookingId, String status, String message, boolean success) {
            this.bookingId = bookingId;
            this.status = status;
            this.message = message;
            this.success = success;
        }
    }
}