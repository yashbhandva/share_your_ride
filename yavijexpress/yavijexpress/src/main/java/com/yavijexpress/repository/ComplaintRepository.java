package com.yavijexpress.repository;

import com.yavijexpress.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByReportedById(Long userId);
    List<Complaint> findByReportedUserId(Long userId);
    List<Complaint> findByStatus(Complaint.ComplaintStatus status);
}