package com.yavijexpress.service.impl;

import com.yavijexpress.dto.VehicleDTO;
import com.yavijexpress.entity.User;
import com.yavijexpress.entity.Vehicle;
import com.yavijexpress.exception.*;
import com.yavijexpress.repository.VehicleRepository;
import com.yavijexpress.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserServiceImpl userService;
    private final ModelMapper modelMapper;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, UserServiceImpl userService, ModelMapper modelMapper) {
        this.vehicleRepository = vehicleRepository;
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @Override
    public VehicleDTO.VehicleResponse addVehicle(Long userId, VehicleDTO.VehicleRequest request) {
        User user = userService.getUserById(userId);

        // Check if vehicle already registered
        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new ResourceAlreadyExistsException("Vehicle already registered");
        }

        // Validate driver role
        if (user.getRole() != User.UserRole.DRIVER) {
            throw new BadRequestException("Only drivers can add vehicles");
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setModel(request.getModel());
        vehicle.setColor(request.getColor());
        vehicle.setTotalSeats(request.getTotalSeats());
        vehicle.setInsuranceNumber(request.getInsuranceNumber());
        vehicle.setInsuranceExpiry(request.getInsuranceExpiry());
        vehicle.setVehicleType(Vehicle.VehicleType.valueOf(request.getVehicleType()));
        vehicle.setUser(user);
        vehicle.setIsActive(true);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return convertToVehicleResponse(savedVehicle);
    }

    @Override
    public VehicleDTO.VehicleResponse updateVehicle(Long vehicleId, VehicleDTO.VehicleRequest request) {
        Vehicle vehicle = getVehicleById(vehicleId);

        if (request.getVehicleNumber() != null) {
            // Check if new vehicle number already exists
            vehicleRepository.findByVehicleNumber(request.getVehicleNumber())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(vehicleId)) {
                            throw new ResourceAlreadyExistsException("Vehicle number already in use");
                        }
                    });
            vehicle.setVehicleNumber(request.getVehicleNumber());
        }

        if (request.getModel() != null) vehicle.setModel(request.getModel());
        if (request.getColor() != null) vehicle.setColor(request.getColor());
        if (request.getTotalSeats() != null) vehicle.setTotalSeats(request.getTotalSeats());
        if (request.getInsuranceNumber() != null) vehicle.setInsuranceNumber(request.getInsuranceNumber());
        if (request.getInsuranceExpiry() != null) vehicle.setInsuranceExpiry(request.getInsuranceExpiry());
        if (request.getVehicleType() != null) {
            vehicle.setVehicleType(Vehicle.VehicleType.valueOf(request.getVehicleType()));
        }

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return convertToVehicleResponse(updatedVehicle);
    }

    @Override
    public void deleteVehicle(Long vehicleId) {
        Vehicle vehicle = getVehicleById(vehicleId);
        vehicle.setIsActive(false);
        vehicleRepository.save(vehicle);
    }

    @Override
    public VehicleDTO.VehicleResponse getVehicleByIdResponse(Long vehicleId) {
        Vehicle vehicle = getVehicleById(vehicleId);
        return convertToVehicleResponse(vehicle);
    }

    @Override
    public List<VehicleDTO.VehicleResponse> getVehiclesByUser(Long userId) {
        List<Vehicle> vehicles = vehicleRepository.findByUserIdAndIsActiveTrue(userId);
        return vehicles.stream()
                .map(this::convertToVehicleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleDTO.VehicleResponse> getAllActiveVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll()
                .stream()
                .filter(Vehicle::getIsActive)
                .collect(Collectors.toList());

        return vehicles.stream()
                .map(this::convertToVehicleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Vehicle getVehicleById(Long vehicleId) {
        return vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
    }

    @Override
    public void checkVehicleInsuranceExpiry() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        vehicles.forEach(vehicle -> {
            if (vehicle.getInsuranceExpiry() != null &&
                    vehicle.getInsuranceExpiry().isBefore(now.plusDays(30))) {
                // Insurance expiring within 30 days
                // Send notification to owner
            }
        });
    }

    private VehicleDTO.VehicleResponse convertToVehicleResponse(Vehicle vehicle) {
        VehicleDTO.VehicleResponse response = modelMapper.map(vehicle, VehicleDTO.VehicleResponse.class);
        response.setOwnerName(vehicle.getUser().getName());
        response.setUserId(vehicle.getUser().getId());
        return response;
    }
}