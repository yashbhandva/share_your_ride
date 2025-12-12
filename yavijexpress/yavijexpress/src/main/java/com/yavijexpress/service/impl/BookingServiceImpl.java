package com.yavijexpress.service.impl;

import com.yavijexpress.dto.BookingDTO;
import com.yavijexpress.entity.*;
import com.yavijexpress.exception.*;
import com.yavijexpress.repository.*;
import com.yavijexpress.repository.UserRepository;
import com.yavijexpress.service.BookingService;
import com.yavijexpress.service.PaymentService;
import com.yavijexpress.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;

    public BookingServiceImpl(BookingRepository bookingRepository, TripRepository tripRepository, UserRepository userRepository, PaymentService paymentService, NotificationService notificationService, ModelMapper modelMapper) {
        this.bookingRepository = bookingRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<BookingDTO.BookingResponse> getDriverBookings(Long driverId) {
        List<Booking> bookings = bookingRepository.findByTripDriverId(driverId);
        return bookings.stream()
                .map(this::convertToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingDTO.BookingResponse createBooking(Long passengerId, BookingDTO.BookingRequest request) {
        try {
            User passenger = userRepository.findById(passengerId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            Trip trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

            // Basic validation
            if (trip.getAvailableSeats() < request.getSeats()) {
                throw new BadRequestException("Not enough seats available");
            }

            // Create booking with PENDING status
            Booking booking = new Booking();
            booking.setSeatsBooked(request.getSeats());
            booking.setTotalAmount(trip.getPricePerSeat() * request.getSeats());
            booking.setStatus(Booking.BookingStatus.PENDING);
            booking.setSpecialRequests(request.getSpecialRequests());
            booking.setTrip(trip);
            booking.setPassenger(passenger);

            Booking savedBooking = bookingRepository.save(booking);

            // Update available seats
            trip.setAvailableSeats(trip.getAvailableSeats() - request.getSeats());
            tripRepository.save(trip);

            // Send notification to driver
            try {
                notificationService.sendBookingRequestNotification(savedBooking);
            } catch (Exception e) {
                // Log but don't fail booking
            }

            return convertToBookingResponse(savedBooking);
        } catch (Exception e) {
            throw new RuntimeException("Booking failed: " + e.getMessage(), e);
        }
    }

    @Override
    public BookingDTO.BookingResponse confirmBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in pending state");
        }

        // Generate 4-6 digit OTP
        String otp = String.format("%06d", (int)(Math.random() * 1000000));
        booking.setPickupOtp(otp);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        Booking confirmedBooking = bookingRepository.save(booking);

        // Send confirmation notifications with OTP (ignore failures)
        try {
            notificationService.sendBookingConfirmedNotification(confirmedBooking);
        } catch (Exception e) {
            // Log but don't fail the booking
        }

        return convertToBookingResponse(confirmedBooking);
    }

    @Override
    public BookingDTO.BookingResponse denyBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in pending state");
        }

        // Update booking status to cancelled
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        Booking deniedBooking = bookingRepository.save(booking);

        // Restore available seats
        Trip trip = booking.getTrip();
        trip.setAvailableSeats(trip.getAvailableSeats() + booking.getSeatsBooked());
        tripRepository.save(trip);

        // Send denial notification (ignore failures)
        try {
            notificationService.sendBookingDeniedNotification(deniedBooking);
        } catch (Exception e) {
            // Log but don't fail the operation
        }

        return convertToBookingResponse(deniedBooking);
    }

    @Override
    public BookingDTO.BookingResponse cancelBooking(Long bookingId, String reason) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel completed booking");
        }

        // Update booking status
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        Booking cancelledBooking = bookingRepository.save(booking);

        // Update available seats
        Trip trip = booking.getTrip();
        trip.setAvailableSeats(trip.getAvailableSeats() + booking.getSeatsBooked());
        tripRepository.save(trip);

        // Process refund if payment was made
        if (booking.getPayment() != null &&
                booking.getPayment().getStatus() == Payment.PaymentStatus.SUCCESS) {
            paymentService.processRefund(booking.getPayment().getId(), reason);
        }

        // Send notifications (ignore failures)
        try {
            notificationService.sendBookingCancelledNotification(cancelledBooking, reason);
        } catch (Exception e) {
            // Log but don't fail the booking
        }

        return convertToBookingResponse(cancelledBooking);
    }

    @Override
    public List<BookingDTO.BookingResponse> getPassengerBookings(Long passengerId) {
        List<Booking> bookings = bookingRepository.findByPassengerId(passengerId);
        return bookings.stream()
                .map(this::convertToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO.BookingResponse> getTripBookings(Long tripId) {
        List<Booking> bookings = bookingRepository.findByTripId(tripId);
        return bookings.stream()
                .map(this::convertToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingDTO.BookingResponse getBookingDetails(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        return convertToBookingResponse(booking);
    }

    @Override
    public void autoCancelPendingBookings() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(30);

        List<Booking> pendingBookings = bookingRepository.findAll()
                .stream()
                .filter(booking -> booking.getStatus() == Booking.BookingStatus.PENDING)
                .filter(booking -> booking.getBookedAt().isBefore(cutoffTime))
                .collect(Collectors.toList());

        pendingBookings.forEach(booking -> {
            cancelBooking(booking.getId(), "Auto-cancelled due to timeout");
        });
    }

    @Override
    public BookingDTO.BookingResponse verifyPickupOtp(Long bookingId, String otp) {
        Booking booking = getBookingById(bookingId);
        
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new BadRequestException("Booking is not confirmed");
        }
        
        if (!otp.equals(booking.getPickupOtp())) {
            throw new BadRequestException("Invalid OTP");
        }
        
        // Mark trip as started
        Trip trip = booking.getTrip();
        trip.setStatus(Trip.TripStatus.ONGOING);
        tripRepository.save(trip);
        
        return convertToBookingResponse(booking);
    }

    @Override
    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
    }

    private BookingDTO.BookingResponse convertToBookingResponse(Booking booking) {
        BookingDTO.BookingResponse response = modelMapper.map(booking, BookingDTO.BookingResponse.class);
        response.setPassengerName(booking.getPassenger().getName());
        response.setPassengerId(booking.getPassenger().getId());
        response.setTripFrom(booking.getTrip().getFromLocation());
        response.setTripTo(booking.getTrip().getToLocation());
        response.setDepartureTime(booking.getTrip().getDepartureTime());
        response.setStatus(booking.getStatus().toString());
        response.setSpecialRequests(booking.getSpecialRequests());
        response.setTripNotes(booking.getTrip().getNotes());
        response.setPickupOtp(booking.getPickupOtp());
        response.setDriverName(booking.getTrip().getDriver().getName());
        response.setDriverPhone(booking.getTrip().getDriver().getMobile());
        response.setVehicleModel(booking.getTrip().getVehicle().getModel());
        response.setVehicleNumber(booking.getTrip().getVehicle().getVehicleNumber());

        if (booking.getPayment() != null) {
            response.setPaymentStatus(booking.getPayment().getStatus().toString());
        } else {
            response.setPaymentStatus("PENDING");
        }

        return response;
    }
}