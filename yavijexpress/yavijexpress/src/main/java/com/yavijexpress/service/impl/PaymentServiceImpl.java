package com.yavijexpress.service.impl;

import com.yavijexpress.dto.PaymentDTO;
import com.yavijexpress.entity.Booking;
import com.yavijexpress.entity.Payment;
import com.yavijexpress.exception.*;
import com.yavijexpress.repository.BookingRepository;
import com.yavijexpress.repository.PaymentRepository;
import com.yavijexpress.service.BookingService;
import com.yavijexpress.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final ModelMapper modelMapper;

    public PaymentServiceImpl(PaymentRepository paymentRepository, BookingRepository bookingRepository, ModelMapper modelMapper) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.modelMapper = modelMapper;
    }

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    @Override
    public PaymentDTO.PaymentResponse processWalletPayment(Long bookingId, Long walletId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only confirmed bookings can be paid using wallet");
        }

        // Check if payment already exists and is successful
        paymentRepository.findByBookingId(booking.getId())
                .ifPresent(payment -> {
                    if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
                        throw new BadRequestException("Payment already completed");
                    }
                });

        // In a real wallet integration, you would:
        // 1. Load wallet by walletId
        // 2. Check balance >= booking.getTotalAmount()
        // 3. Deduct amount and save wallet
        // For now, assume wallet has sufficient balance and mark payment as SUCCESS.

        Payment payment = new Payment();
        payment.setAmount(booking.getTotalAmount());
        payment.setMethod(Payment.PaymentMethod.WALLET);
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setBooking(booking);
        payment.setNotes("Paid via wallet ID: " + walletId);

        Payment savedPayment = paymentRepository.save(payment);

        // Link payment to booking
        booking.setPayment(savedPayment);
        // If you have a BookingRepository / BookingService save, call it here

        return convertToPaymentResponse(savedPayment);
    }

    @Override
    public PaymentDTO.PaymentResponse getRefundStatus(Long refundId) {
        Payment payment = paymentRepository.findById(refundId)
                .orElseThrow(() -> new ResourceNotFoundException("Refund/payment not found"));

        if (payment.getStatus() != Payment.PaymentStatus.REFUNDED) {
            // You can either return the current status or throw an error.
            // Here we throw to make it explicit.
            throw new BadRequestException("Refund not processed yet. Current status: " + payment.getStatus());
        }

        return convertToPaymentResponse(payment);
    }

    @Override
    public java.util.List<PaymentDTO.PaymentResponse> getUserPayments(Long userId) {
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getBooking() != null
                        && payment.getBooking().getPassenger() != null
                        && userId.equals(payment.getBooking().getPassenger().getId()))
                .map(this::convertToPaymentResponse)
                .toList();
    }

    @Override
    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }

    @Override
    public void reconcilePayments() {
        java.time.LocalDateTime cutoff = java.time.LocalDateTime.now().minusMinutes(30);

        paymentRepository.findAll().stream()
                .filter(payment -> payment.getStatus() == Payment.PaymentStatus.PENDING)
                .filter(payment -> payment.getCreatedAt() != null && payment.getCreatedAt().isBefore(cutoff))
                .forEach(payment -> {
                    payment.setStatus(Payment.PaymentStatus.FAILED);
                    payment.setNotes((payment.getNotes() != null ? payment.getNotes() + " | " : "")
                            + "Auto-failed by reconciliation job due to timeout");
                    paymentRepository.save(payment);
                });
    }

    @Override
    public PaymentDTO.RazorpayOrderResponse createRazorpayOrder(PaymentDTO.RazorpayOrderRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));        // Validate booking
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new BadRequestException("Only confirmed bookings can be paid");
        }

        // Check if payment already exists
        paymentRepository.findByBookingId(booking.getId())
                .ifPresent(payment -> {
                    if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
                        throw new BadRequestException("Payment already completed");
                    }
                });

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", request.getAmount() * 100); // Convert to paise
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", "receipt_" + booking.getId());
            orderRequest.put("payment_capture", 1);

            Order order = razorpay.orders.create(orderRequest);

            // Create payment record
            Payment payment = new Payment();
            payment.setAmount(request.getAmount());
            payment.setMethod(Payment.PaymentMethod.RAZORPAY);
            payment.setStatus(Payment.PaymentStatus.PENDING);
            payment.setRazorpayOrderId(order.get("id"));
            payment.setBooking(booking);

            Payment savedPayment = paymentRepository.save(payment);

            // Update booking with payment
            booking.setPayment(savedPayment);
            // Save booking via booking service

            // Prepare response
            PaymentDTO.RazorpayOrderResponse response = new PaymentDTO.RazorpayOrderResponse();
            response.setOrderId(order.get("id"));
            response.setAmount(order.get("amount").toString());
            response.setCurrency(order.get("currency"));
            response.setKey(razorpayKeyId);
            response.setDescription("Payment for booking #" + booking.getId());
            response.setBookingId(booking.getId().toString());

            return response;

        } catch (RazorpayException e) {
            throw new PaymentException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    @Override
    public PaymentDTO.PaymentResponse verifyPayment(PaymentDTO.PaymentVerifyRequest request) {
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        try {
            // Verify payment signature
            String generatedSignature = generateSignature(
                    request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                    razorpayKeySecret
            );

            if (!generatedSignature.equals(request.getRazorpaySignature())) {
                throw new PaymentException("Invalid payment signature");
            }

            // Update payment status
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            payment.setCompletedAt(LocalDateTime.now());

            Payment savedPayment = paymentRepository.save(payment);

            // Update booking status if needed
            Booking booking = payment.getBooking();
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                // Booking is already confirmed, just mark payment as success
            }

            return convertToPaymentResponse(savedPayment);

        } catch (Exception e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new PaymentException("Payment verification failed: " + e.getMessage());
        }
    }

    @Override
    public PaymentDTO.PaymentResponse processCashPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        // Create cash payment record
        Payment payment = new Payment();
        payment.setAmount(booking.getTotalAmount());
        payment.setMethod(Payment.PaymentMethod.CASH);
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setBooking(booking);
        payment.setNotes("Cash payment to be collected from passenger");

        Payment savedPayment = paymentRepository.save(payment);

        // Update booking
        booking.setPayment(savedPayment);
        // Save booking via booking service

        return convertToPaymentResponse(savedPayment);
    }

    @Override
    public void processRefund(Long paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() != Payment.PaymentStatus.SUCCESS) {
            throw new BadRequestException("Only successful payments can be refunded");
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject refundRequest = new JSONObject();
            refundRequest.put("amount", payment.getAmount() * 100);
            refundRequest.put("speed", "normal");

            JSONObject notes = new JSONObject();
            notes.put("reason", reason);
            refundRequest.put("notes", notes);

            // Update payment status
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            payment.setNotes("Refunded: " + reason);
            paymentRepository.save(payment);

        } catch (Exception e) {
            throw new PaymentException("Refund failed: " + e.getMessage());
        }
    }

    @Override
    public PaymentDTO.PaymentResponse getPaymentDetails(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return convertToPaymentResponse(payment);
    }

    @Override
    public PaymentDTO.PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking"));
        return convertToPaymentResponse(payment);
    }

    private String generateSignature(String data, String secret) {
        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            mac.init(new javax.crypto.spec.SecretKeySpec(secret.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(data.getBytes());

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new PaymentException("Failed to generate signature");
        }
    }

    private PaymentDTO.PaymentResponse convertToPaymentResponse(Payment payment) {
        PaymentDTO.PaymentResponse response = modelMapper.map(payment, PaymentDTO.PaymentResponse.class);
        response.setMethod(payment.getMethod().toString());
        response.setStatus(payment.getStatus().toString());
        response.setBookingId(payment.getBooking().getId().toString());
        return response;
    }
}