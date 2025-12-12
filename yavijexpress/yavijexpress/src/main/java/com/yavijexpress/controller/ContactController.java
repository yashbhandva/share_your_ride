package com.yavijexpress.controller;

import com.yavijexpress.dto.ContactMessageDTO;
import com.yavijexpress.entity.ContactMessage;
import com.yavijexpress.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submitContact(@Valid @RequestBody ContactMessageDTO.ContactRequest request) {
        try {
            ContactMessage contact = new ContactMessage();
            contact.setName(request.getName());
            contact.setEmail(request.getEmail());
            contact.setSubject(request.getSubject());
            contact.setMessage(request.getMessage());
            
            ContactMessage saved = contactMessageRepository.save(contact);
            
            return ResponseEntity.ok(com.yavijexpress.dto.ApiResponse.success(null, "Message sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                com.yavijexpress.dto.ApiResponse.error("Failed to send message: " + e.getMessage())
            );
        }
    }
}