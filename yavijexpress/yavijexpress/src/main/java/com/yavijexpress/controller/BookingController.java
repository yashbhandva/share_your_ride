package com.yavijexpress.controller;

import com.yavijexpress.dto.BookingDTO;
import com.yavijexpress.service.BookingService;
import com.yavijexpress.exception.BadRequestException;
import com.yavijexpress.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingDTO.BookingRequest request) {
        try {
            Long passengerId = com.yavijexpress.utils.SecurityUtils.getCurrentUserId();
            if (passengerId == null) {
                return ResponseEntity.status(401).body(
                    com.yavijexpress.dto.ApiResponse.error("User not authenticated")
                );
            }
            BookingDTO.BookingResponse response = bookingService.createBooking(passengerId, request);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(response, "Booking created successfully"));
        } catch (BadRequestException e) {
            return ResponseEntity.status(400).body(
                com.yavijexpress.dto.ApiResponse.error(e.getMessage())
            );
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(
                com.yavijexpress.dto.ApiResponse.error(e.getMessage())
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to create booking: " + e.getMessage())
            );
        }
    }

    @PostMapping("/{bookingId}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long bookingId) {
        try {
            System.out.println("Confirming booking: " + bookingId);
            BookingDTO.BookingResponse response = bookingService.confirmBooking(bookingId);
            System.out.println("Booking confirmed successfully, OTP: " + response.getPickupOtp());
            BookingDTO.BookingActionResponse actionResponse = new BookingDTO.BookingActionResponse(
                bookingId, "CONFIRMED", "✅ Booking confirmed successfully. OTP sent to passenger.", true
            );
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(actionResponse, "Booking confirmed successfully"));
        } catch (Exception e) {
            System.out.println("Failed to confirm booking: " + e.getMessage());
            e.printStackTrace();
            BookingDTO.BookingActionResponse actionResponse = new BookingDTO.BookingActionResponse(
                bookingId, "ERROR", e.getMessage(), false
            );
            return ResponseEntity.status(400).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to confirm booking: " + e.getMessage())
            );
        }
    }

    @PostMapping("/{bookingId}/deny")
    public ResponseEntity<?> denyBooking(@PathVariable Long bookingId) {
        try {
            BookingDTO.BookingResponse response = bookingService.denyBooking(bookingId);
            BookingDTO.BookingActionResponse actionResponse = new BookingDTO.BookingActionResponse(
                bookingId, "DENIED", "Booking denied successfully", true
            );
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(actionResponse, "Booking denied successfully"));
        } catch (Exception e) {
            BookingDTO.BookingActionResponse actionResponse = new BookingDTO.BookingActionResponse(
                bookingId, "ERROR", e.getMessage(), false
            );
            return ResponseEntity.status(400).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to deny booking: " + e.getMessage())
            );
        }
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long bookingId,
            @RequestParam(required = false) String reason) {
        try {
            BookingDTO.BookingResponse response = bookingService.cancelBooking(bookingId,
                    reason != null ? reason : "Cancelled by user");
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(response, "Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to cancel booking: " + e.getMessage())
            );
        }
    }

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<?> getPassengerBookings(
            @PathVariable Long passengerId) {
        try {
            List<BookingDTO.BookingResponse> bookings = bookingService.getPassengerBookings(passengerId);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(bookings, "Bookings retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to get bookings: " + e.getMessage())
            );
        }
    }

    @GetMapping("/trip/{tripId}")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<BookingDTO.BookingResponse>> getTripBookings(@PathVariable Long tripId) {
        return ResponseEntity.ok(bookingService.getTripBookings(tripId));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<?> getDriverBookings(@PathVariable Long driverId) {
        try {
            List<BookingDTO.BookingResponse> bookings = bookingService.getDriverBookings(driverId);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(bookings, "Driver bookings retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to get driver bookings: " + e.getMessage())
            );
        }
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO.BookingResponse> getBookingDetails(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingDetails(bookingId));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyPickupOtp(@Valid @RequestBody BookingDTO.OtpVerificationRequest request) {
        try {
            System.out.println("OTP Verification Request: BookingId=" + request.getBookingId() + ", OTP=" + request.getOtp());
            BookingDTO.BookingResponse response = bookingService.verifyPickupOtp(request.getBookingId(), request.getOtp());
            BookingDTO.BookingActionResponse actionResponse = new BookingDTO.BookingActionResponse(
                request.getBookingId(), "VERIFIED", "✅ OTP Verified Successfully! Trip can now start.", true
            );
            System.out.println("OTP Verification Success");
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(actionResponse, "OTP verified successfully"));
        } catch (Exception e) {
            System.out.println("OTP Verification Failed: " + e.getMessage());
            e.printStackTrace();
            BookingDTO.BookingActionResponse actionResponse = new BookingDTO.BookingActionResponse(
                request.getBookingId(), "INVALID_OTP", "❌ Invalid OTP. Please check and try again.", false
            );
            return ResponseEntity.status(400).body(
                com.yavijexpress.dto.ApiResponse.error("OTP verification failed: " + e.getMessage())
            );
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success("API is working", "Test successful"));
    }
}