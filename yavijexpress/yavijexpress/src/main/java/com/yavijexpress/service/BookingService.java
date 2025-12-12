package com.yavijexpress.service;

import com.yavijexpress.dto.BookingDTO;
import com.yavijexpress.entity.Booking;
import java.util.List;

public interface BookingService {

    // Booking Operations
    BookingDTO.BookingResponse createBooking(Long passengerId, BookingDTO.BookingRequest request);
    BookingDTO.BookingResponse confirmBooking(Long bookingId);
    BookingDTO.BookingResponse cancelBooking(Long bookingId, String reason);

    // Queries
    List<BookingDTO.BookingResponse> getPassengerBookings(Long passengerId);
    List<BookingDTO.BookingResponse> getTripBookings(Long tripId);
    BookingDTO.BookingResponse getBookingDetails(Long bookingId);

    // Utility
    Booking getBookingById(Long bookingId);
    void autoCancelPendingBookings(); // For cron job
    List<BookingDTO.BookingResponse> getDriverBookings(Long driverId);
    BookingDTO.BookingResponse verifyPickupOtp(Long bookingId, String otp);
}