package com.yavijexpress.service;

import com.yavijexpress.dto.ComplaintDTO;
import com.yavijexpress.entity.Complaint;
import java.util.List;

public interface ComplaintService {
    ComplaintDTO.ComplaintResponse submitComplaint(ComplaintDTO.ComplaintRequest request);
    ComplaintDTO.ComplaintResponse updateComplaintStatus(Long complaintId, ComplaintDTO.ComplaintUpdateRequest request);
    List<ComplaintDTO.ComplaintResponse> getUserComplaints(Long userId);
    List<ComplaintDTO.ComplaintResponse> getComplaintsAgainstUser(Long userId);
    List<ComplaintDTO.ComplaintResponse> getAllComplaints(String status);
    ComplaintDTO.ComplaintResponse getComplaintDetails(Long complaintId);
    void escalateComplaint(Long complaintId, String reason);
    Complaint getComplaintById(Long complaintId);
}