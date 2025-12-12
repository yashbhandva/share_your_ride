package com.yavijexpress.repository;

import com.yavijexpress.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    List<ContactMessage> findByStatusOrderByCreatedAtDesc(ContactMessage.Status status);
    Long countByStatus(ContactMessage.Status status);
}