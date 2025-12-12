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
    
    @Autowired
    private com.yavijexpress.repository.TripRepository tripRepository2;

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
            trip.setIsActive(true);
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
    public ResponseEntity<?> searchTrips(
            @Valid @RequestBody TripDTO.TripSearchRequest request) {
        try {
            List<TripDTO.TripResponse> trips = tripService.searchTrips(request);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(trips, "Trips found"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to search trips: " + e.getMessage())
            );
        }
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

    @DeleteMapping("/{tripId}/delete")
    public ResponseEntity<?> deleteTrip(@PathVariable Long tripId) {
        try {
            Long userId = com.yavijexpress.utils.SecurityUtils.getCurrentUserId();
            com.yavijexpress.entity.Trip trip = tripRepository2.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
            
            // Check if user owns this trip
            if (!trip.getDriver().getId().equals(userId)) {
                return ResponseEntity.status(403).body(
                    com.yavijexpress.dto.ApiResponse.error("You can only delete your own trips")
                );
            }
            
            tripRepository2.delete(trip);
            
            return ResponseEntity.ok(
                com.yavijexpress.dto.ApiResponse.success(null, "Trip deleted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to delete trip: " + e.getMessage())
            );
        }
    }

    @PutMapping("/{tripId}/restart")
    public ResponseEntity<?> restartTrip(@PathVariable Long tripId) {
        try {
            Long userId = com.yavijexpress.utils.SecurityUtils.getCurrentUserId();
            com.yavijexpress.entity.Trip trip = tripRepository2.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
            
            // Check if user owns this trip
            if (!trip.getDriver().getId().equals(userId)) {
                return ResponseEntity.status(403).body(
                    com.yavijexpress.dto.ApiResponse.error("You can only restart your own trips")
                );
            }
            
            // Reset trip to scheduled status
            trip.setStatus(com.yavijexpress.entity.Trip.TripStatus.SCHEDULED);
            trip.setIsActive(true);
            tripRepository2.save(trip);
            
            return ResponseEntity.ok(
                com.yavijexpress.dto.ApiResponse.success(null, "Trip restarted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to restart trip: " + e.getMessage())
            );
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingTrips() {
        try {
            List<TripDTO.TripResponse> trips = tripService.getUpcomingTrips();
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(trips, "Upcoming trips retrieved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to get upcoming trips: " + e.getMessage())
            );
        }
    }


}