package com.yavijexpress.service;

import com.yavijexpress.dto.ContactDTO;
import java.util.List;

public interface ContactService {
    ContactDTO.ContactResponse submitContactMessage(ContactDTO.ContactRequest request);
    List<ContactDTO.ContactResponse> getAllContactMessages();
    ContactDTO.ContactResponse updateMessageStatus(Long id, String status);
}