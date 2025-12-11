package com.yavijexpress.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class EmergencySecurityConfig {

    // Allow emergency endpoints without authentication
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/emergency/sos").permitAll() // Allow SOS without auth
                        .requestMatchers("/api/emergency/location").permitAll()
                        .anyRequest().authenticated()
                );
    }
}