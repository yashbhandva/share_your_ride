package com.yavijexpress.controller;

import com.yavijexpress.dto.ContactDTO;
import com.yavijexpress.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<?> submitContactMessage(@Valid @RequestBody ContactDTO.ContactRequest request) {
        try {
            ContactDTO.ContactResponse response = contactService.submitContactMessage(request);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(response, "Message sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to send message: " + e.getMessage())
            );
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllContactMessages() {
        try {
            List<ContactDTO.ContactResponse> messages = contactService.getAllContactMessages();
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(messages, "Messages retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to retrieve messages: " + e.getMessage())
            );
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateMessageStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            ContactDTO.ContactResponse response = contactService.updateMessageStatus(id, status);
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(response, "Status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to update status: " + e.getMessage())
            );
        }
    }
}