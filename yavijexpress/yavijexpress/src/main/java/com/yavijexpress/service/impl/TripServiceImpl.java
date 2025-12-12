package com.yavijexpress.service.impl;

import com.yavijexpress.dto.TripDTO;
import com.yavijexpress.entity.*;
import com.yavijexpress.exception.*;
import com.yavijexpress.repository.*;
import com.yavijexpress.service.TripService;
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
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final UserServiceImpl userService;
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;

    public TripServiceImpl(TripRepository tripRepository, VehicleRepository vehicleRepository, UserServiceImpl userService, BookingRepository bookingRepository, NotificationService notificationService, ModelMapper modelMapper) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.userService = userService;
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        this.modelMapper = modelMapper;
    }

    @Override
    public void checkAndUpdateTripStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // Fetch all trips (JpaRepository provides findAll())
        List<Trip> trips = tripRepository.findAll();

        for (Trip trip : trips) {
            // If the trip was scheduled and departure time has passed, mark it as ONGOING
            if (trip.getStatus() == Trip.TripStatus.SCHEDULED
                    && trip.getDepartureTime() != null
                    && trip.getDepartureTime().isBefore(now)) {
                trip.setStatus(Trip.TripStatus.ONGOING);
            }

            // If the trip is ongoing and expected arrival time has passed, mark it as COMPLETED
            if (trip.getStatus() == Trip.TripStatus.ONGOING
                    && trip.getExpectedArrivalTime() != null
                    && trip.getExpectedArrivalTime().isBefore(now)) {
                trip.setStatus(Trip.TripStatus.COMPLETED);
            }
        }

        tripRepository.saveAll(trips);
    }
    @Override
    public TripDTO.TripResponse createTrip(Long driverId, TripDTO.TripRequest request) {
        User driver = userService.getUserById(driverId);

        // Allow any authenticated user to create trips
        // if (driver.getRole() != User.UserRole.DRIVER) {
        //     throw new BadRequestException("Only drivers can create trips");
        // }
        // if (driver.getVerificationStatus() != User.VerificationStatus.VERIFIED) {
        //     throw new BadRequestException("Driver must be verified to create trips");
        // }

        // Validate vehicle
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.getUser().getId().equals(driverId)) {
            throw new BadRequestException("Vehicle does not belong to driver");
        }

        // Check if vehicle is active
        if (!vehicle.getIsActive()) {
            throw new BadRequestException("Vehicle is not active");
        }

        // Validate departure time (must be future)
        if (request.getDepartureTime().isBefore(LocalDateTime.now().plusMinutes(30))) {
            throw new BadRequestException("Departure time must be at least 30 minutes from now");
        }

        // Create trip
        Trip trip = new Trip();
        trip.setFromLocation(request.getFromLocation());
        trip.setToLocation(request.getToLocation());
        trip.setDepartureTime(request.getDepartureTime());

        // Calculate expected arrival (assuming 60 km/h average speed)
        if (request.getDistanceKm() != null) {
            double hours = request.getDistanceKm() / 60.0;
            trip.setExpectedArrivalTime(request.getDepartureTime().plusHours((long) hours));
            trip.setDistanceKm(request.getDistanceKm());
        } else {
            trip.setExpectedArrivalTime(request.getDepartureTime().plusHours(2)); // default 2 hours
        }

        trip.setPricePerSeat(request.getPricePerSeat());
        trip.setTotalSeats(request.getTotalSeats());
        trip.setAvailableSeats(request.getTotalSeats());
        trip.setStatus(Trip.TripStatus.SCHEDULED);
        trip.setRoutePolyline(request.getRoutePolyline());
        trip.setIsFlexible(request.getIsFlexible());
        trip.setNotes(request.getNotes());
        trip.setDriver(driver);
        trip.setVehicle(vehicle);
        trip.setSoberDeclaration(false); // Must be set before trip start

        Trip savedTrip = tripRepository.save(trip);

        // Send notification to nearby passengers
        notificationService.sendTripCreatedNotification(savedTrip);

        return convertToTripResponse(savedTrip);
    }

    @Override
    public TripDTO.TripResponse updateTrip(Long tripId, TripDTO.TripRequest request) {
        Trip trip = getTripById(tripId);

        // Can only update if trip is scheduled and not started
        if (trip.getStatus() != Trip.TripStatus.SCHEDULED) {
            throw new BadRequestException("Can only update scheduled trips");
        }

        // Check if departure is within 1 hour (no updates allowed)
        if (trip.getDepartureTime().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new BadRequestException("Cannot update trip within 1 hour of departure");
        }

        if (request.getFromLocation() != null) trip.setFromLocation(request.getFromLocation());
        if (request.getToLocation() != null) trip.setToLocation(request.getToLocation());
        if (request.getDepartureTime() != null) {
            // Validate new departure time
            if (request.getDepartureTime().isBefore(LocalDateTime.now().plusMinutes(30))) {
                throw new BadRequestException("Departure time must be at least 30 minutes from now");
            }
            trip.setDepartureTime(request.getDepartureTime());
        }
        if (request.getPricePerSeat() != null) trip.setPricePerSeat(request.getPricePerSeat());
        if (request.getTotalSeats() != null) {
            // Cannot reduce seats below already booked seats
            int bookedSeats = getBookedSeats(tripId);
            if (request.getTotalSeats() < bookedSeats) {
                throw new BadRequestException("Cannot reduce seats below already booked seats: " + bookedSeats);
            }
            trip.setTotalSeats(request.getTotalSeats());
            trip.setAvailableSeats(request.getTotalSeats() - bookedSeats);
        }
        if (request.getRoutePolyline() != null) trip.setRoutePolyline(request.getRoutePolyline());
        if (request.getDistanceKm() != null) trip.setDistanceKm(request.getDistanceKm());
        if (request.getIsFlexible() != null) trip.setIsFlexible(request.getIsFlexible());
        if (request.getNotes() != null) trip.setNotes(request.getNotes());

        Trip updatedTrip = tripRepository.save(trip);

        // Notify passengers about trip update
        notificationService.sendTripUpdatedNotification(updatedTrip);

        return convertToTripResponse(updatedTrip);
    }

    @Override
    public void cancelTrip(Long tripId, String reason) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() == Trip.TripStatus.CANCELLED) {
            throw new BadRequestException("Trip is already cancelled");
        }

        if (trip.getStatus() == Trip.TripStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel completed trip");
        }

        // Update trip status
        trip.setStatus(Trip.TripStatus.CANCELLED);
        tripRepository.save(trip);

        // Cancel all bookings and process refunds
        List<Booking> bookings = bookingRepository.findByTripId(tripId);
        bookings.forEach(booking -> {
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                booking.setStatus(Booking.BookingStatus.CANCELLED);
                booking.setCancelledAt(LocalDateTime.now());
                bookingRepository.save(booking);

                // Process refund if payment was made
                if (booking.getPayment() != null) {
                    // Call payment service to refund
                }
            }
        });

        // Send notifications to passengers
        notificationService.sendTripCancelledNotification(trip, reason);
    }

    @Override
    public List<TripDTO.TripResponse> searchTrips(TripDTO.TripSearchRequest request) {
        // Use current time as minimum departure if no date specified
        LocalDateTime startDate = request.getDepartureDate() != null
                ? request.getDepartureDate()
                : LocalDateTime.now();

        List<Trip> trips = tripRepository.searchTrips(
                request.getFromLocation(),
                request.getToLocation(),
                startDate,
                request.getRequiredSeats()
        );

        // Filter by max price if provided
        if (request.getMaxPrice() != null) {
            trips = trips.stream()
                    .filter(trip -> trip.getPricePerSeat() <= request.getMaxPrice())
                    .collect(Collectors.toList());
        }

        return trips.stream()
                .map(this::convertToTripResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TripDTO.TripResponse> getDriverTrips(Long driverId) {
        List<Trip> trips = tripRepository.findByDriverId(driverId);
        return trips.stream()
                .map(this::convertToTripResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TripDTO.TripResponse getTripDetails(Long tripId) {
        Trip trip = getTripById(tripId);
        return convertToTripResponse(trip);
    }

    @Override
    public void startTrip(Long tripId, TripDTO.SoberDeclarationRequest request) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() != Trip.TripStatus.SCHEDULED) {
            throw new BadRequestException("Trip is not in scheduled state");
        }

        // Verify OTP (sent to driver's mobile)
        // OTP verification logic here

        if (!request.getSoberDeclaration()) {
            throw new BadRequestException("Sober declaration is required to start trip");
        }

        trip.setSoberDeclaration(true);
        trip.setStatus(Trip.TripStatus.ONGOING);
        tripRepository.save(trip);

        // Send notifications to passengers
        notificationService.sendTripStartedNotification(trip);
    }

    @Override
    public void completeTrip(Long tripId) {
        Trip trip = getTripById(tripId);

        if (trip.getStatus() != Trip.TripStatus.ONGOING) {
            throw new BadRequestException("Only ongoing trips can be completed");
        }

        trip.setStatus(Trip.TripStatus.COMPLETED);
        tripRepository.save(trip);

        // Update driver and passenger ride counts
        User driver = trip.getDriver();
        driver.setTotalRides(driver.getTotalRides() + 1);
        // Update user via userService

        // Mark bookings as completed
        List<Booking> bookings = bookingRepository.findByTripId(tripId);
        bookings.forEach(booking -> {
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                booking.setStatus(Booking.BookingStatus.COMPLETED);
                bookingRepository.save(booking);

                // Update passenger ride count
                User passenger = booking.getPassenger();
                passenger.setTotalRides(passenger.getTotalRides() + 1);
                // Update user via userService
            }
        });

        notificationService.sendTripCompletedNotification(trip);
    }

    @Override
    public List<TripDTO.TripResponse> getUpcomingTrips() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusDays(7);

        List<Trip> trips = tripRepository.findByDepartureTimeBetween(now, future);

        return trips.stream()
                .filter(trip -> trip.getStatus() == Trip.TripStatus.SCHEDULED && 
                               Boolean.TRUE.equals(trip.getIsActive()))
                .map(this::convertToTripResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Trip getTripById(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
    }

    private int getBookedSeats(Long tripId) {
        List<Booking> bookings = bookingRepository.findConfirmedBookingsByTripId(tripId);
        return bookings.stream()
                .mapToInt(Booking::getSeatsBooked)
                .sum();
    }

    private TripDTO.TripResponse convertToTripResponse(Trip trip) {
        TripDTO.TripResponse response = modelMapper.map(trip, TripDTO.TripResponse.class);
        response.setDriverName(trip.getDriver().getName());
        response.setDriverId(trip.getDriver().getId());
        response.setVehicleModel(trip.getVehicle().getModel());
        response.setVehicleNumber(trip.getVehicle().getVehicleNumber());
        response.setStatus(trip.getStatus().toString());
        response.setIsActive(trip.getIsActive());
        response.setNotes(trip.getNotes());
        return response;
    }
}