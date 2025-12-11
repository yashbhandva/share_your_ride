package com.yavijexpress.controller;

import com.yavijexpress.dto.BookingDTO;
import com.yavijexpress.service.BookingService;
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
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<BookingDTO.BookingResponse> createBooking(
            @RequestHeader("X-User-ID") Long passengerId,
            @Valid @RequestBody BookingDTO.BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(passengerId, request));
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
    @PreAuthorize("hasRole('PASSENGER')")
    public ResponseEntity<List<BookingDTO.BookingResponse>> getPassengerBookings(
            @PathVariable Long passengerId) {
        return ResponseEntity.ok(bookingService.getPassengerBookings(passengerId));
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