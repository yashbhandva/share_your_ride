package com.yavijexpress.repository;

import com.yavijexpress.entity.Notification;
import com.yavijexpress.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
    Long countByUserIdAndIsReadFalse(Long userId);
    
    @Modifying
    @Transactional
    void deleteByUser(User user);
}