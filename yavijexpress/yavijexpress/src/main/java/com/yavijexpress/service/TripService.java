package com.yavijexpress.service;

import com.yavijexpress.dto.TripDTO;
import com.yavijexpress.entity.Trip;
import java.util.List;

public interface TripService {

    // CRUD Operations
    TripDTO.TripResponse createTrip(Long driverId, TripDTO.TripRequest request);
    TripDTO.TripResponse updateTrip(Long tripId, TripDTO.TripRequest request);
    void cancelTrip(Long tripId, String reason);

    // Search & Queries
    List<TripDTO.TripResponse> searchTrips(TripDTO.TripSearchRequest request);
    List<TripDTO.TripResponse> getDriverTrips(Long driverId);
    TripDTO.TripResponse getTripDetails(Long tripId);

    // Trip Management
    void startTrip(Long tripId, TripDTO.SoberDeclarationRequest request);
    void completeTrip(Long tripId);
    List<TripDTO.TripResponse> getUpcomingTrips();

    // Utility
    Trip getTripById(Long tripId);
    void checkAndUpdateTripStatuses(); // For cron job
}