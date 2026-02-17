package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

public class EmergencyDTO {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SOSRequest {
        @NotNull
        private Long tripId;
        @NotBlank
        private String message;
        private Double latitude;
        private Double longitude;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EmergencyAlertResponse {
        private Long alertId;
        private String status;
        private String message;
        private LocalDateTime sentAt;
        private Boolean authoritiesNotified;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LiveLocationRequest {
        @NotNull private Long tripId;
        @NotNull private Double latitude;
        @NotNull private Double longitude;
    }
}