package com.yavijexpress.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "emergency_alerts")
public class EmergencyAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "user_id", nullable = false)
    private Long userId; // User who triggered the alert

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType alertType;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertStatus status;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = AlertStatus.ACTIVE;
    }

    public enum AlertType {
        SOS, ACCIDENT, HARASSMENT, VEHICLE_BREAKDOWN,
        DRIVER_PANIC, PASSENGER_PANIC, MEDICAL_EMERGENCY
    }

    public enum AlertStatus {
        ACTIVE, IN_PROGRESS, RESOLVED, FALSE_ALARM
    }
}