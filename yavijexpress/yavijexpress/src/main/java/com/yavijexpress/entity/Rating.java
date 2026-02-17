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
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer stars; // 1-5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatingType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "given_by_id", nullable = false)
    private User givenBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "given_to_id", nullable = false)
    private User givenTo;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum RatingType {
        DRIVER_TO_PASSENGER, PASSENGER_TO_DRIVER
    }
}