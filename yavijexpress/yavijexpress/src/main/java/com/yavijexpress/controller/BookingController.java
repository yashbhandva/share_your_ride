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
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<BookingDTO.BookingResponse> confirmBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.confirmBooking(bookingId));
    }

    @PostMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingDTO.BookingResponse> cancelBooking(
            @PathVariable Long bookingId,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId,
                reason != null ? reason : "Cancelled by user"));
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

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO.BookingResponse> getBookingDetails(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingDetails(bookingId));
    }
}