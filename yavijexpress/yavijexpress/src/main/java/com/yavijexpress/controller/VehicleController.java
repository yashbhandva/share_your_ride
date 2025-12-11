package com.yavijexpress.controller;

import com.yavijexpress.dto.VehicleDTO;
import com.yavijexpress.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<VehicleDTO.VehicleResponse> addVehicle(
            @RequestHeader("X-User-ID") Long userId,
            @Valid @RequestBody VehicleDTO.VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.addVehicle(userId, request));
    }

    @PutMapping("/{vehicleId}")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<VehicleDTO.VehicleResponse> updateVehicle(
            @PathVariable Long vehicleId,
            @Valid @RequestBody VehicleDTO.VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(vehicleId, request));
    }

    @DeleteMapping("/{vehicleId}")
    @PreAuthorize("hasRole('DRIVER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long vehicleId) {
        vehicleService.deleteVehicle(vehicleId);
        return ResponseEntity.ok("Vehicle deleted successfully");
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleDTO.VehicleResponse> getVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(vehicleService.getVehicleByIdResponse(vehicleId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VehicleDTO.VehicleResponse>> getUserVehicles(@PathVariable Long userId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByUser(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VehicleDTO.VehicleResponse>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllActiveVehicles());
    }
}