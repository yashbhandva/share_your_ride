package com.yavijexpress.service;

import com.yavijexpress.dto.PaymentDTO;
import com.yavijexpress.entity.Payment;
import java.util.List;

public interface PaymentService {

    // Payment Processing
    PaymentDTO.RazorpayOrderResponse createRazorpayOrder(PaymentDTO.RazorpayOrderRequest request);
    PaymentDTO.PaymentResponse verifyPayment(PaymentDTO.PaymentVerifyRequest request);
    PaymentDTO.PaymentResponse processCashPayment(Long bookingId);
    PaymentDTO.PaymentResponse processWalletPayment(Long bookingId, Long walletId);

    // Refunds
    void processRefund(Long paymentId, String reason);
    PaymentDTO.PaymentResponse getRefundStatus(Long refundId);

    // Queries
    PaymentDTO.PaymentResponse getPaymentDetails(Long paymentId);
    PaymentDTO.PaymentResponse getPaymentByBookingId(Long bookingId);
    List<PaymentDTO.PaymentResponse> getUserPayments(Long userId);

    // Utility
    Payment getPaymentById(Long paymentId);
    void reconcilePayments(); // For cron job
}