package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class RatingDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RatingRequest {
        @NotNull private Long bookingId;
        @NotNull @Min(1) @Max(5) private Integer stars;
        private String comment;
        @NotBlank private String type; // DRIVER_TO_PASSENGER or PASSENGER_TO_DRIVER
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RatingResponse {
        private Long id;
        private Integer stars;
        private String comment;
        private String type;
        private String givenByName;
        private String givenToName;
        private LocalDateTime createdAt;
    }
}