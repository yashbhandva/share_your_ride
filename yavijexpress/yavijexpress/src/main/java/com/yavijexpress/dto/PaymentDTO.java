package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class PaymentDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentRequest {
        @NotNull private Long bookingId;
        @NotBlank private String method; // RAZORPAY, CASH
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RazorpayOrderRequest {
        @NotNull private Long bookingId;
        @NotNull @Positive private Double amount;
        @NotBlank private String currency = "INR";
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RazorpayOrderResponse {
        private String orderId;
        private String amount;
        private String currency;
        private String key;
        private String name = "YaVij Express";
        private String description;
        private String bookingId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentVerifyRequest {
        @NotBlank
        private String razorpayPaymentId;
        @NotBlank
        private String razorpayOrderId;
        @NotBlank
        private String razorpaySignature;
        @NotNull
        private Long bookingId;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PaymentResponse {
        private Long id;
        private String transactionId;
        private Double amount;
        private String method;
        private String status;
        private String bookingId;
        private LocalDateTime createdAt;
    }
}