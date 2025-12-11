package com.yavijexpress.repository;

import com.yavijexpress.entity.EmergencyAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert, Long> {
    List<EmergencyAlert> findByTripId(Long tripId);
    List<EmergencyAlert> findByUserId(Long userId);
    List<EmergencyAlert> findByStatus(EmergencyAlert.AlertStatus status);
    List<EmergencyAlert> findByTripIdAndStatus(Long tripId, EmergencyAlert.AlertStatus status);
}