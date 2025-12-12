// FILE: DataInitializer.java
package com.yavijexpress.config;

import com.yavijexpress.entity.User;
import com.yavijexpress.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// @Component - Commented out to prevent dummy data creation
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Dummy data creation disabled - using original database data only
        System.out.println("✅ Using original database data - no dummy data created");
    }
}