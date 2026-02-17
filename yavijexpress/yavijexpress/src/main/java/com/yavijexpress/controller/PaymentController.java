package com.yavijexpress.controller;

import com.yavijexpress.dto.ApiResponse;
import com.yavijexpress.dto.PaymentDTO;
import com.yavijexpress.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/wallet/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentDTO.PaymentResponse>> processWalletPayment(
            @PathVariable Long bookingId,
            @RequestParam Long walletId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.processWalletPayment(bookingId, walletId), "Wallet payment processed successfully"));
    }

    @GetMapping("/refund/{refundId}/status")
    public ResponseEntity<ApiResponse<PaymentDTO.PaymentResponse>> getRefundStatus(@PathVariable Long refundId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getRefundStatus(refundId), "Refund status retrieved"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PaymentDTO.PaymentResponse>>> getUserPayments(
            @PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getUserPayments(userId), "User payments retrieved"));
    }

    @PostMapping("/razorpay/order")
    public ResponseEntity<ApiResponse<PaymentDTO.RazorpayOrderResponse>> createRazorpayOrder(
            @Valid @RequestBody PaymentDTO.RazorpayOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.createRazorpayOrder(request), "Razorpay order created"));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<ApiResponse<PaymentDTO.PaymentResponse>> verifyPayment(
            @Valid @RequestBody PaymentDTO.PaymentVerifyRequest request) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.verifyPayment(request), "Payment verified successfully"));
    }

    @PostMapping("/cash/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentDTO.PaymentResponse>> processCashPayment(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.processCashPayment(bookingId), "Cash payment processed successfully"));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<?>> processRefund(
            @PathVariable Long paymentId,
            @RequestParam String reason) {
        paymentService.processRefund(paymentId, reason);
        return ResponseEntity.ok(ApiResponse.success(null, "Refund processed successfully"));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentDTO.PaymentResponse>> getPaymentDetails(@PathVariable Long paymentId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentDetails(paymentId), "Payment details retrieved"));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<ApiResponse<PaymentDTO.PaymentResponse>> getPaymentByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentByBookingId(bookingId), "Payment details retrieved"));
    }
}