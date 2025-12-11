package com.yavijexpress.service;

import com.yavijexpress.dto.VehicleDTO;
import com.yavijexpress.entity.Vehicle;

import java.util.List;

public interface VehicleService {

    VehicleDTO.VehicleResponse addVehicle(Long userId, VehicleDTO.VehicleRequest request);

    VehicleDTO.VehicleResponse updateVehicle(Long vehicleId, VehicleDTO.VehicleRequest request);

    void deleteVehicle(Long vehicleId);

    VehicleDTO.VehicleResponse getVehicleByIdResponse(Long vehicleId);

    List<VehicleDTO.VehicleResponse> getVehiclesByUser(Long userId);

    List<VehicleDTO.VehicleResponse> getAllActiveVehicles();

    Vehicle getVehicleById(Long vehicleId);

    void checkVehicleInsuranceExpiry();
}