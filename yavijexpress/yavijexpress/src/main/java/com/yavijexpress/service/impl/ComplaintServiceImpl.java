package com.yavijexpress.service.impl;

import com.yavijexpress.dto.ComplaintDTO;
import com.yavijexpress.entity.*;
import com.yavijexpress.exception.*;
import com.yavijexpress.repository.ComplaintRepository;
import com.yavijexpress.service.ComplaintService;
import com.yavijexpress.service.UserService;
import com.yavijexpress.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final ModelMapper modelMapper;

    @Autowired
    public ComplaintServiceImpl(ComplaintRepository complaintRepository, UserService userService, NotificationService notificationService, ModelMapper modelMapper) {
        this.complaintRepository = complaintRepository;
        this.userService = userService;
        this.notificationService = notificationService;
        this.modelMapper = modelMapper;
    }

    @Override
    public ComplaintDTO.ComplaintResponse submitComplaint(ComplaintDTO.ComplaintRequest request) {
        User reportedBy = userService.getUserById(extractUserIdFromContext()); // Get from security context

        // Validate reported user if provided
        User reportedUser = null;
        if (request.getReportedUserId() != null) {
            reportedUser = userService.getUserById(request.getReportedUserId());
        }

        // Validate complaint type
        Complaint.ComplaintType complaintType;
        try {
            complaintType = Complaint.ComplaintType.valueOf(request.getType());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid complaint type");
        }

        // Create complaint
        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setType(complaintType);
        complaint.setStatus(Complaint.ComplaintStatus.OPEN);
        complaint.setReportedBy(reportedBy);
        complaint.setReportedUser(reportedUser);
        complaint.setCreatedAt(LocalDateTime.now());

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Notify admin about new complaint
        notifyAdminAboutComplaint(savedComplaint);

        // Send confirmation to complainant
        notificationService.sendComplaintSubmittedNotification(savedComplaint);

        return convertToComplaintResponse(savedComplaint);
    }

    @Override
    public ComplaintDTO.ComplaintResponse updateComplaintStatus(Long complaintId, ComplaintDTO.ComplaintUpdateRequest request) {
        Complaint complaint = getComplaintById(complaintId);

        // Validate status
        Complaint.ComplaintStatus newStatus;
        try {
            newStatus = Complaint.ComplaintStatus.valueOf(request.getStatus());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid complaint status");
        }

        // Check if complaint can be updated
        if (complaint.getStatus() == Complaint.ComplaintStatus.RESOLVED &&
                newStatus != Complaint.ComplaintStatus.RESOLVED) {
            throw new BadRequestException("Cannot change status of resolved complaint");
        }

        complaint.setStatus(newStatus);
        complaint.setAdminResponse(request.getAdminResponse());

        if (newStatus == Complaint.ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        Complaint updatedComplaint = complaintRepository.save(complaint);

        // Notify complainant about status update
        notificationService.sendComplaintStatusUpdateNotification(updatedComplaint);

        return convertToComplaintResponse(updatedComplaint);
    }

    @Override
    public List<ComplaintDTO.ComplaintResponse> getUserComplaints(Long userId) {
        List<Complaint> complaints = complaintRepository.findByReportedById(userId);
        return complaints.stream()
                .map(this::convertToComplaintResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintDTO.ComplaintResponse> getComplaintsAgainstUser(Long userId) {
        List<Complaint> complaints = complaintRepository.findByReportedUserId(userId);
        return complaints.stream()
                .map(this::convertToComplaintResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintDTO.ComplaintResponse> getAllComplaints(String status) {
        List<Complaint> complaints;

        if (status != null && !status.isEmpty()) {
            try {
                Complaint.ComplaintStatus complaintStatus = Complaint.ComplaintStatus.valueOf(status);
                complaints = complaintRepository.findByStatus(complaintStatus);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid complaint status");
            }
        } else {
            complaints = complaintRepository.findAll();
        }

        return complaints.stream()
                .map(this::convertToComplaintResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ComplaintDTO.ComplaintResponse getComplaintDetails(Long complaintId) {
        Complaint complaint = getComplaintById(complaintId);
        return convertToComplaintResponse(complaint);
    }

    @Override
    public void escalateComplaint(Long complaintId, String reason) {
        Complaint complaint = getComplaintById(complaintId);

        if (complaint.getStatus() != Complaint.ComplaintStatus.OPEN) {
            throw new BadRequestException("Only open complaints can be escalated");
        }

        // Mark as escalated (special status or add flag)
        // In our entity, we don't have escalation flag, so we can use admin response
        complaint.setAdminResponse("[ESCALATED] " + reason + "\n" +
                (complaint.getAdminResponse() != null ? complaint.getAdminResponse() : ""));

        complaintRepository.save(complaint);

        // Notify higher authorities
        notificationService.sendComplaintEscalationNotification(complaint, reason);
    }

    @Override
    public Complaint getComplaintById(Long complaintId) {
        return complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
    }

    private void notifyAdminAboutComplaint(Complaint complaint) {
        String adminMessage = String.format(
                "New Complaint: %s\nType: %s\nReported By: %s\nDescription: %s",
                complaint.getTitle(),
                complaint.getType(),
                complaint.getReportedBy().getName(),
                complaint.getDescription()
        );

        // Get all admin users and notify them
        List<User> admins = userService.getAllUsers("ADMIN").stream()
                .map(dto -> userService.getUserById(dto.getId()))
                .toList();

        admins.forEach(admin -> {
            notificationService.sendAdminNotification(
                    admin,
                    "New Complaint #" + complaint.getId(),
                    adminMessage,
                    "COMPLAINT",
                    complaint.getId()
            );
        });
    }

    private ComplaintDTO.ComplaintResponse convertToComplaintResponse(Complaint complaint) {
        ComplaintDTO.ComplaintResponse response = modelMapper.map(complaint, ComplaintDTO.ComplaintResponse.class);
        response.setType(complaint.getType().toString());
        response.setStatus(complaint.getStatus().toString());
        response.setReportedByName(complaint.getReportedBy().getName());

        if (complaint.getReportedUser() != null) {
            response.setReportedUserName(complaint.getReportedUser().getName());
        }

        return response;
    }

    private Long extractUserIdFromContext() {
        // In real implementation, get from SecurityContext
        // For now, return dummy
        return 1L;
    }
}