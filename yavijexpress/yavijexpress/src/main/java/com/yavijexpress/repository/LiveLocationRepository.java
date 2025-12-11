package com.yavijexpress.repository;

import com.yavijexpress.entity.LiveLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LiveLocationRepository extends JpaRepository<LiveLocation, Long> {
    List<LiveLocation> findByTripId(Long tripId);
    List<LiveLocation> findByTripIdOrderByUpdatedAtDesc(Long tripId);
    List<LiveLocation> findByUserId(Long userId);
}