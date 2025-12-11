package com.yavijexpress.service;

import com.yavijexpress.dto.RatingDTO;
import com.yavijexpress.entity.Rating;
import java.util.List;

public interface RatingService {

    // Rating Operations
    RatingDTO.RatingResponse submitRating(RatingDTO.RatingRequest request);
    RatingDTO.RatingResponse updateRating(Long ratingId, RatingDTO.RatingRequest request);
    void deleteRating(Long ratingId);

    // Queries
    List<RatingDTO.RatingResponse> getRatingsForUser(Long userId);
    RatingDTO.RatingResponse getRatingForBooking(Long bookingId);
    Double getAverageRating(Long userId);
    List<RatingDTO.RatingResponse> getRecentRatings(int limit);

    // Utility
    Rating getRatingById(Long ratingId);
    void calculateUserRatings(Long userId); // Recalculate average
}