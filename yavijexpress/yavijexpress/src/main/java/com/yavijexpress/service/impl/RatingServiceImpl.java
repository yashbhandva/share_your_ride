package com.yavijexpress.service.impl;

import com.yavijexpress.dto.RatingDTO;
import com.yavijexpress.entity.*;
import com.yavijexpress.exception.*;
import com.yavijexpress.repository.RatingRepository;
import com.yavijexpress.service.BookingService;
import com.yavijexpress.service.RatingService;
import com.yavijexpress.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final BookingService bookingService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public RatingServiceImpl(RatingRepository ratingRepository, BookingService bookingService, UserService userService, ModelMapper modelMapper) {
        this.ratingRepository = ratingRepository;
        this.bookingService = bookingService;
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @Override
    public RatingDTO.RatingResponse updateRating(Long ratingId, RatingDTO.RatingRequest request) {
        // 1. Fetch existing rating
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        // 2. (Optional) Ensure the booking matches if provided
        if (request.getBookingId() != null &&
                !rating.getBooking().getId().equals(request.getBookingId())) {
            throw new BadRequestException("Cannot change booking of an existing rating");
        }

        // 3. Update basic fields
        rating.setStars(request.getStars());
        rating.setComment(request.getComment());

        // 4. (Optional) Allow changing type with validation
        if (request.getType() != null) {
            Rating.RatingType ratingType;
            try {
                ratingType = Rating.RatingType.valueOf(request.getType());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid rating type");
            }

            // Business rule: do not change who rates whom for this booking
            // so we keep givenBy, givenTo as they are, only update the type
            rating.setType(ratingType);
        }

        Rating savedRating = ratingRepository.save(rating);

        // 5. Recalculate average for receiver
        updateUserAverageRating(savedRating.getGivenTo().getId());

        return convertToRatingResponse(savedRating);
    }

    @Override
    public List<RatingDTO.RatingResponse> getRecentRatings(int limit) {
        if (limit <= 0) {
            throw new BadRequestException("Limit must be greater than 0");
        }

        // Use pagination to fetch most recent ratings
        var pageable = org.springframework.data.domain.PageRequest.of(0, limit);
        var page = ratingRepository.findAllByOrderByCreatedAtDesc(pageable);
        List<Rating> ratings = page.getContent();

        return ratings.stream()
                .map(this::convertToRatingResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public Rating getRatingById(Long ratingId) {
        return ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));
    }

    @Override
    public void calculateUserRatings(Long userId) {
        // Currently just delegates to existing logic
        updateUserAverageRating(userId);
    }
    @Override
    public RatingDTO.RatingResponse submitRating(RatingDTO.RatingRequest request) {
        Booking booking = bookingService.getBookingById(request.getBookingId());

        // Validate booking status
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Can only rate completed bookings");
        }

        // Check if rating already exists
        ratingRepository.findByBookingId(booking.getId())
                .ifPresent(rating -> {
                    throw new ResourceAlreadyExistsException("Rating already submitted for this booking");
                });

        // Validate rating type
        Rating.RatingType ratingType;
        try {
            ratingType = Rating.RatingType.valueOf(request.getType());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid rating type");
        }

        // Determine who is giving rating to whom
        User givenBy, givenTo;

        if (ratingType == Rating.RatingType.PASSENGER_TO_DRIVER) {
            givenBy = booking.getPassenger();
            givenTo = booking.getTrip().getDriver();
        } else if (ratingType == Rating.RatingType.DRIVER_TO_PASSENGER) {
            givenBy = booking.getTrip().getDriver();
            givenTo = booking.getPassenger();
        } else {
            throw new BadRequestException("Invalid rating type");
        }

        // Create rating
        Rating rating = new Rating();
        rating.setStars(request.getStars());
        rating.setComment(request.getComment());
        rating.setType(ratingType);
        rating.setGivenBy(givenBy);
        rating.setGivenTo(givenTo);
        rating.setBooking(booking);

        Rating savedRating = ratingRepository.save(rating);

        // Update user's average rating
        updateUserAverageRating(givenTo.getId());

        return convertToRatingResponse(savedRating);
    }

    @Override
    public List<RatingDTO.RatingResponse> getRatingsForUser(Long userId) {
        List<Rating> ratings = ratingRepository.findByGivenToId(userId);
        return ratings.stream()
                .map(this::convertToRatingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RatingDTO.RatingResponse getRatingForBooking(Long bookingId) {
        Rating rating = ratingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found for booking"));
        return convertToRatingResponse(rating);
    }

    @Override
    public Double getAverageRating(Long userId) {
        Double average = ratingRepository.findAverageRatingByUserId(userId);
        return average != null ? average : 0.0;
    }

    @Override
    public void deleteRating(Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found"));

        ratingRepository.delete(rating);

        // Recalculate average rating for the user
        updateUserAverageRating(rating.getGivenTo().getId());
    }

    private void updateUserAverageRating(Long userId) {
        Double averageRating = ratingRepository.findAverageRatingByUserId(userId);
        Integer ratingCount = ratingRepository.countRatingsByUserId(userId);

        User user = userService.getUserById(userId);
        user.setAvgRating(averageRating != null ? averageRating : 0.0);

        // Update user via userService
    }

    private RatingDTO.RatingResponse convertToRatingResponse(Rating rating) {
        RatingDTO.RatingResponse response = modelMapper.map(rating, RatingDTO.RatingResponse.class);
        response.setType(rating.getType().toString());
        response.setGivenByName(rating.getGivenBy().getName());
        response.setGivenToName(rating.getGivenTo().getName());
        return response;
    }
}