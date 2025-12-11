package com.yavijexpress.service;

import com.yavijexpress.dto.EmergencyDTO;
import com.yavijexpress.entity.EmergencyAlert;
import java.util.List;
import java.util.Map;

public interface EmergencyService {
    EmergencyDTO.EmergencyAlertResponse sendSOS(EmergencyDTO.SOSRequest request);
    void sendDriverPanicAlert(Long tripId, Long driverId, String reason);
    void updateLiveLocation(EmergencyDTO.LiveLocationRequest request);
    List<Map<String, String>> getEmergencyContacts(Long userId);
    void resolveEmergency(Long alertId, String resolutionNotes);
    List<EmergencyAlert> getActiveEmergencies();
}