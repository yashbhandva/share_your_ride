package com.yavijexpress.service;

import com.yavijexpress.dto.RatingDTO;
import com.yavijexpress.entity.Rating;
import java.util.List;

public interface RatingService {

    RatingDTO.RatingResponse submitRating(Long userId, RatingDTO.RatingRequest request);
    RatingDTO.RatingResponse updateRating(Long ratingId, RatingDTO.RatingRequest request);
    void deleteRating(Long ratingId);
    List<RatingDTO.RatingResponse> getRatingsForUser(Long userId);
    RatingDTO.RatingResponse getRatingForBooking(Long bookingId);
    Double getAverageRating(Long userId);
    List<RatingDTO.RatingResponse> getRecentRatings(int limit);
    Rating getRatingById(Long ratingId);
    void calculateUserRatings(Long userId);
}