package com.yavijexpress.repository;

import com.yavijexpress.entity.Rating;
import com.yavijexpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByGivenToId(Long userId);
    Optional<Rating> findByBookingId(Long bookingId);

    @Query("SELECT AVG(r.stars) FROM Rating r WHERE r.givenTo.id = :userId")
    Double findAverageRatingByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Rating r WHERE r.givenTo.id = :userId")
    Integer countRatingsByUserId(@Param("userId") Long userId);

    Page<Rating> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    @Modifying
    @Transactional
    void deleteByGivenBy(User user);
    
    @Modifying
    @Transactional
    void deleteByGivenTo(User user);
}