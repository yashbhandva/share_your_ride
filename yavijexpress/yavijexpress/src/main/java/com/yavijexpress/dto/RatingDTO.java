package com.yavijexpress.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

public class RatingDTO {

    @Data
    public static class RatingRequest {
        @NotNull private Long bookingId;
        @NotNull @Min(1) @Max(5) private Integer stars;
        private String comment;
        @NotBlank private String type; // DRIVER_TO_PASSENGER or PASSENGER_TO_DRIVER

        public Long getBookingId() {
            return bookingId;
        }

        public void setBookingId(Long bookingId) {
            this.bookingId = bookingId;
        }

        public Integer getStars() {
            return stars;
        }

        public void setStars(Integer stars) {
            this.stars = stars;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }

    @Data
    public static class RatingResponse {
        private Long id;
        private Integer stars;
        private String comment;
        private String type;
        private String givenByName;
        private String givenToName;
        private LocalDateTime createdAt;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Integer getStars() {
            return stars;
        }

        public void setStars(Integer stars) {
            this.stars = stars;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getGivenByName() {
            return givenByName;
        }

        public void setGivenByName(String givenByName) {
            this.givenByName = givenByName;
        }

        public String getGivenToName() {
            return givenToName;
        }

        public void setGivenToName(String givenToName) {
            this.givenToName = givenToName;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}