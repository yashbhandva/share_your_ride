package com.yavijexpress.repository;

import com.yavijexpress.entity.Booking;
import com.yavijexpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.passenger.id = :passengerId ORDER BY b.bookedAt DESC")
    List<Booking> findByPassengerId(@Param("passengerId") Long passengerId);
    List<Booking> findByTripId(Long tripId);
    @Query("SELECT b FROM Booking b WHERE b.trip.driver.id = :driverId ORDER BY b.bookedAt DESC")
    List<Booking> findByTripDriverId(@Param("driverId") Long driverId);

    @Query("SELECT b FROM Booking b WHERE b.trip.id = :tripId AND b.status = 'CONFIRMED'")
    List<Booking> findConfirmedBookingsByTripId(@Param("tripId") Long tripId);

    Optional<Booking> findByTripIdAndPassengerId(Long tripId, Long passengerId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.passenger.id = :passengerId AND b.status = 'COMPLETED'")
    Long countCompletedBookingsByPassenger(@Param("passengerId") Long passengerId);
    
    Long countByStatus(Booking.BookingStatus status);
    
    @Modifying
    @Transactional
    void deleteByPassenger(User passenger);
}