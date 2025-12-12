package com.yavijexpress.service.impl;

import com.yavijexpress.dto.ContactDTO;
import com.yavijexpress.entity.ContactMessage;
import com.yavijexpress.repository.ContactMessageRepository;
import com.yavijexpress.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactServiceImpl(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @Override
    public ContactDTO.ContactResponse submitContactMessage(ContactDTO.ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setSubject(request.getSubject());
        message.setMessage(request.getMessage());
        message.setStatus(ContactMessage.Status.NEW);

        ContactMessage savedMessage = contactMessageRepository.save(message);
        return convertToResponse(savedMessage);
    }

    @Override
    public List<ContactDTO.ContactResponse> getAllContactMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ContactDTO.ContactResponse updateMessageStatus(Long id, String status) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact message not found"));
        
        message.setStatus(ContactMessage.Status.valueOf(status.toUpperCase()));
        ContactMessage updatedMessage = contactMessageRepository.save(message);
        return convertToResponse(updatedMessage);
    }

    private ContactDTO.ContactResponse convertToResponse(ContactMessage message) {
        ContactDTO.ContactResponse response = new ContactDTO.ContactResponse();
        response.setId(message.getId());
        response.setName(message.getName());
        response.setEmail(message.getEmail());
        response.setSubject(message.getSubject());
        response.setMessage(message.getMessage());
        response.setStatus(message.getStatus().toString());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}