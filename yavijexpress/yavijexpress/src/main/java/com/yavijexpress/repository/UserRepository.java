package com.yavijexpress.repository;

import com.yavijexpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    Boolean existsByEmail(String email);
    Boolean existsByMobile(String mobile);

    List<User> findByRole(User.UserRole role);
    List<User> findByVerificationStatus(User.VerificationStatus status);

    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.role = 'DRIVER'")
    List<User> findAllActiveDrivers();
    List<User> findByRoleAndVerificationStatus(User.UserRole role, User.VerificationStatus status);
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    Long countByRole(User.UserRole role);
    
    Long countByRoleAndIsActive(User.UserRole role, Boolean isActive);
}