package com.yavijexpress.repository;

import com.yavijexpress.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByDriverId(Long driverId);
    List<Trip> findByStatus(Trip.TripStatus status);

    @Query("SELECT t FROM Trip t WHERE t.isActive = true ORDER BY t.departureTime ASC")
    List<Trip> searchTrips(@Param("from") String from,
                           @Param("to") String to,
                           @Param("startDate") LocalDateTime startDate,
                           @Param("seats") Integer seats);

    @Query("SELECT t FROM Trip t WHERE t.driver.id = :driverId AND t.status IN ('SCHEDULED', 'ONGOING')")
    List<Trip> findActiveTripsByDriver(@Param("driverId") Long driverId);

    @Query("SELECT COUNT(t) FROM Trip t WHERE t.driver.id = :driverId AND t.status = 'COMPLETED'")
    Long countCompletedTripsByDriver(@Param("driverId") Long driverId);

    List<Trip> findByDepartureTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT t FROM Trip t WHERE t.isActive = true ORDER BY t.departureTime ASC")
    List<Trip> findAllActiveTrips();
}