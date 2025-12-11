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



    @PostMapping
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<TripDTO.TripResponse> createTrip(
            @RequestHeader("X-User-ID") Long driverId,
            @Valid @RequestBody TripDTO.TripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(driverId, request));
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