package com.yavijexpress.controller;

import com.yavijexpress.dto.RatingDTO;
import com.yavijexpress.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private  RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingDTO.RatingResponse> submitRating(
            @Valid @RequestBody RatingDTO.RatingRequest request) {
        return ResponseEntity.ok(ratingService.submitRating(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingDTO.RatingResponse>> getUserRatings(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingsForUser(userId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<RatingDTO.RatingResponse> getBookingRating(@PathVariable Long bookingId) {
        return ResponseEntity.ok(ratingService.getRatingForBooking(bookingId));
    }

    @GetMapping("/user/{userId}/average")
    public ResponseEntity<Double> getUserAverageRating(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getAverageRating(userId));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<?> deleteRating(@PathVariable Long ratingId) {
        ratingService.deleteRating(ratingId);
        return ResponseEntity.ok("Rating deleted successfully");
    }
}