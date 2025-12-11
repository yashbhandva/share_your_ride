package com.yavijexpress.controller;

import com.yavijexpress.dto.EmergencyDTO;
import com.yavijexpress.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @PostMapping("/sos")
    public ResponseEntity<EmergencyDTO.EmergencyAlertResponse> sendSOS(
            @Valid @RequestBody EmergencyDTO.SOSRequest request) {
        return ResponseEntity.ok(emergencyService.sendSOS(request));
    }

    @PostMapping("/location")
    public ResponseEntity<?> updateLiveLocation(
            @Valid @RequestBody EmergencyDTO.LiveLocationRequest request) {
        emergencyService.updateLiveLocation(request);
        return ResponseEntity.ok("Location updated");
    }

    @GetMapping("/contacts/{userId}")
    public ResponseEntity<?> getEmergencyContacts(@PathVariable Long userId) {
        return ResponseEntity.ok(emergencyService.getEmergencyContacts(userId));
    }
}