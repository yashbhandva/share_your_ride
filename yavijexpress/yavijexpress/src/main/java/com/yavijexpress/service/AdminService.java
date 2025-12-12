package com.yavijexpress.service;

import com.yavijexpress.dto.AdminDTO;
import com.yavijexpress.entity.User;
import java.util.List;

public interface AdminService {
    AdminDTO.DashboardStats getDashboardStats();
    List<AdminDTO.UserManagement> getAllUsers();
    List<AdminDTO.TripManagement> getAllTrips();
    AdminDTO.UserManagement updateUserStatus(Long userId, Boolean isActive);
    AdminDTO.UserManagement updateUserVerification(Long userId, String status);
    void deleteUser(Long userId);
    void deleteTrip(Long tripId);
}