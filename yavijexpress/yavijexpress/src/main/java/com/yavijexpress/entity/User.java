package com.yavijexpress.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String mobile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    private String aadhaarNumber;
    private String drivingLicense;

    @Column(nullable = false)
    private Boolean isActive = true;

    private Double avgRating = 0.0;
    private Integer totalRides = 0;

    private String emergencyContact1;
    private String emergencyContact2;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Vehicle> vehicles = new HashSet<>();

    @OneToMany(mappedBy = "driver")
    private Set<Trip> trips = new HashSet<>();

    @OneToMany(mappedBy = "passenger")
    private Set<Booking> bookings = new HashSet<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum UserRole {
        ADMIN, DRIVER, PASSENGER
    }

    public enum VerificationStatus {
        PENDING, VERIFIED, REJECTED, SUSPENDED
    }
}