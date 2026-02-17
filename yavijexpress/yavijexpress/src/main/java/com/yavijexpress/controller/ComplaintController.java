package com.yavijexpress.controller;

import com.yavijexpress.dto.ApiResponse;
import com.yavijexpress.dto.ComplaintDTO;
import com.yavijexpress.service.ComplaintService;
import com.yavijexpress.utils.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ComplaintDTO.ComplaintResponse>> submitComplaint(
            @Valid @RequestBody ComplaintDTO.ComplaintRequest request) {
        ComplaintDTO.ComplaintResponse response = complaintService.submitComplaint(request);
        return ResponseEntity.ok(ApiResponse.created(response, "Complaint submitted successfully"));
    }

    @GetMapping("/my-complaints")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ComplaintDTO.ComplaintResponse>>> getMyComplaints() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<ComplaintDTO.ComplaintResponse> complaints = complaintService.getUserComplaints(userId);
        return ResponseEntity.ok(ApiResponse.success(complaints, "User complaints retrieved"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ComplaintDTO.ComplaintResponse>>> getAllComplaints(
            @RequestParam(required = false) String status) {
        List<ComplaintDTO.ComplaintResponse> complaints = complaintService.getAllComplaints(status);
        return ResponseEntity.ok(ApiResponse.success(complaints, "All complaints retrieved"));
    }

    @GetMapping("/{complaintId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ComplaintDTO.ComplaintResponse>> getComplaintDetails(
            @PathVariable Long complaintId) {
        ComplaintDTO.ComplaintResponse complaint = complaintService.getComplaintDetails(complaintId);
        return ResponseEntity.ok(ApiResponse.success(complaint, "Complaint details retrieved"));
    }

    @PutMapping("/{complaintId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintDTO.ComplaintResponse>> updateComplaintStatus(
            @PathVariable Long complaintId,
            @Valid @RequestBody ComplaintDTO.ComplaintUpdateRequest request) {
        ComplaintDTO.ComplaintResponse updatedComplaint = complaintService.updateComplaintStatus(complaintId, request);
        return ResponseEntity.ok(ApiResponse.success(updatedComplaint, "Complaint status updated"));
    }
}