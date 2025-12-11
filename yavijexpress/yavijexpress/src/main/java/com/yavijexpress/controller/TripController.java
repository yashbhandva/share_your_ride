package com.yavijexpress.controller;

import com.yavijexpress.dto.TripDTO;
import com.yavijexpress.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {


    @Autowired
    private TripService tripService;

    @PostMapping("/status/check-and-update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> checkAndUpdateTripStatuses() {
        tripService.checkAndUpdateTripStatuses();
        return ResponseEntity.ok("Trip statuses checked and updated");
    }



    @Autowired
    private com.yavijexpress.repository.TripRepository tripRepository;
    
    @Autowired
    private com.yavijexpress.repository.UserRepository userRepository;
    
    @Autowired
    private com.yavijexpress.repository.VehicleRepository vehicleRepository;

    @PostMapping
    public ResponseEntity<?> createTrip(
            @Valid @RequestBody TripDTO.TripRequest request) {
        try {
            Long driverId = com.yavijexpress.utils.SecurityUtils.getCurrentUserId();
            
            // Get actual user and vehicle from database
            com.yavijexpress.entity.User user = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            com.yavijexpress.entity.Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
            
            // Create trip
            com.yavijexpress.entity.Trip trip = new com.yavijexpress.entity.Trip();
            trip.setFromLocation(request.getFromLocation());
            trip.setToLocation(request.getToLocation());
            trip.setDepartureTime(request.getDepartureTime());
            trip.setExpectedArrivalTime(request.getExpectedArrivalTime() != null ? 
                request.getExpectedArrivalTime() : request.getDepartureTime().plusHours(2));
            trip.setPricePerSeat(request.getPricePerSeat());
            trip.setTotalSeats(request.getTotalSeats());
            trip.setAvailableSeats(request.getTotalSeats());
            trip.setDistanceKm(request.getDistanceKm());
            trip.setIsFlexible(request.getIsFlexible());
            trip.setNotes(request.getNotes());
            trip.setStatus(com.yavijexpress.entity.Trip.TripStatus.SCHEDULED);
            trip.setDriver(user);
            trip.setVehicle(vehicle);
            
            // Save to database
            com.yavijexpress.entity.Trip savedTrip = tripRepository.save(trip);
            
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(savedTrip, "Trip created successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to create trip: " + e.getMessage())
            );
        }
    }

    @PutMapping("/{tripId}")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<TripDTO.TripResponse> updateTrip(
            @PathVariable Long tripId,
            @Valid @RequestBody TripDTO.TripRequest request) {
        return ResponseEntity.ok(tripService.updateTrip(tripId, request));
    }

    @DeleteMapping("/{tripId}")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> cancelTrip(
            @PathVariable Long tripId,
            @RequestParam(required = false) String reason) {
        tripService.cancelTrip(tripId, reason != null ? reason : "Cancelled by driver");
        return ResponseEntity.ok("Trip cancelled successfully");
    }

    @PostMapping("/search")
    public ResponseEntity<List<TripDTO.TripResponse>> searchTrips(
            @Valid @RequestBody TripDTO.TripSearchRequest request) {
        return ResponseEntity.ok(tripService.searchTrips(request));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<TripDTO.TripResponse>> getDriverTrips(@PathVariable Long driverId) {
        return ResponseEntity.ok(tripService.getDriverTrips(driverId));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripDTO.TripResponse> getTripDetails(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripService.getTripDetails(tripId));
    }

    @PostMapping("/{tripId}/start")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> startTrip(
            @PathVariable Long tripId,
            @Valid @RequestBody TripDTO.SoberDeclarationRequest request) {
        tripService.startTrip(tripId, request);
        return ResponseEntity.ok("Trip started successfully");
    }

    @PostMapping("/{tripId}/complete")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<?> completeTrip(@PathVariable Long tripId) {
        tripService.completeTrip(tripId);
        return ResponseEntity.ok("Trip completed successfully");
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<TripDTO.TripResponse>> getUpcomingTrips() {
        return ResponseEntity.ok(tripService.getUpcomingTrips());
    }
}