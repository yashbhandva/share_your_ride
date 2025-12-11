// FILE: DataInitializer.java
package com.yavijexpress.config;

import com.yavijexpress.entity.User;
import com.yavijexpress.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (userRepository.findByEmail("admin@yavij.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@yavij.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setMobile("9999999999");
            admin.setRole(User.UserRole.ADMIN);
            admin.setVerificationStatus(User.VerificationStatus.VERIFIED);
            admin.setIsActive(true);
            admin.setAvgRating(5.0);
            admin.setTotalRides(0);

            userRepository.save(admin);
            System.out.println("✅ Admin user created successfully!");
        }

        // Create test driver if not exists
        if (userRepository.findByEmail("driver@test.com").isEmpty()) {
            User driver = new User();
            driver.setName("Test Driver");
            driver.setEmail("driver@test.com");
            driver.setPassword(passwordEncoder.encode("Driver@123"));
            driver.setMobile("8888888888");
            driver.setRole(User.UserRole.DRIVER);
            driver.setVerificationStatus(User.VerificationStatus.VERIFIED);
            driver.setIsActive(true);
            driver.setAvgRating(4.5);
            driver.setTotalRides(50);

            userRepository.save(driver);
            System.out.println("✅ Test driver created successfully!");
        }

        // Create test passenger if not exists
        if (userRepository.findByEmail("passenger@test.com").isEmpty()) {
            User passenger = new User();
            passenger.setName("Test Passenger");
            passenger.setEmail("passenger@test.com");
            passenger.setPassword(passwordEncoder.encode("Passenger@123"));
            passenger.setMobile("7777777777");
            passenger.setRole(User.UserRole.PASSENGER);
            passenger.setVerificationStatus(User.VerificationStatus.VERIFIED);
            passenger.setIsActive(true);
            passenger.setAvgRating(4.8);
            passenger.setTotalRides(30);

            userRepository.save(passenger);
            System.out.println("✅ Test passenger created successfully!");
        }
    }
}