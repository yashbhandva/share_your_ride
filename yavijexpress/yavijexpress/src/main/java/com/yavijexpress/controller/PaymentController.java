package com.yavijexpress.controller;

import com.yavijexpress.dto.PaymentDTO;
import com.yavijexpress.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/wallet/{bookingId}")
    public ResponseEntity<PaymentDTO.PaymentResponse> processWalletPayment(
            @PathVariable Long bookingId,
            @RequestParam Long walletId) {
        return ResponseEntity.ok(paymentService.processWalletPayment(bookingId, walletId));
    }

    @GetMapping("/refund/{refundId}/status")
    public ResponseEntity<PaymentDTO.PaymentResponse> getRefundStatus(@PathVariable Long refundId) {
        return ResponseEntity.ok(paymentService.getRefundStatus(refundId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<java.util.List<PaymentDTO.PaymentResponse>> getUserPayments(
            @PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getUserPayments(userId));
    }

    @PostMapping("/razorpay/order")
    public ResponseEntity<PaymentDTO.RazorpayOrderResponse> createRazorpayOrder(
            @Valid @RequestBody PaymentDTO.RazorpayOrderRequest request) {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(request));
    }

    @PostMapping("/razorpay/verify")
    public ResponseEntity<PaymentDTO.PaymentResponse> verifyPayment(
            @Valid @RequestBody PaymentDTO.PaymentVerifyRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

    @PostMapping("/cash/{bookingId}")
    public ResponseEntity<PaymentDTO.PaymentResponse> processCashPayment(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.processCashPayment(bookingId));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<?> processRefund(
            @PathVariable Long paymentId,
            @RequestParam String reason) {
        paymentService.processRefund(paymentId, reason);
        return ResponseEntity.ok("Refund processed successfully");
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDTO.PaymentResponse> getPaymentDetails(@PathVariable Long paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentDetails(paymentId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentDTO.PaymentResponse> getPaymentByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBookingId(bookingId));
    }
}