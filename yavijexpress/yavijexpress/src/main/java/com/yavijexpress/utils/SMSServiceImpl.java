package com.yavijexpress.utils;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SMSServiceImpl {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${sms.provider.url:https://api.msg91.com/api/v2/sendsms}")
    private String smsProviderUrl;

    @Value("${sms.auth.key:test_key}")
    private String authKey;

    @Value("${sms.sender.id:YAVIJX}")
    private String senderId;

    @Value("${sms.enabled:false}")
    private boolean smsEnabled;
    
    private static final Logger log = LoggerFactory.getLogger(SMSServiceImpl.class);

    public void sendSMS(String to, String message) {
        if (!smsEnabled) {
            log.info("SMS Disabled. Would send to {}: {}", to, message);
            return;
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("sender", senderId);
            requestBody.put("route", "4"); // Transactional route
            requestBody.put("country", "91");

            Map<String, Object> smsData = new HashMap<>();
            smsData.put("message", message);
            smsData.put("to", new String[]{to});

            requestBody.put("sms", new Object[]{smsData});

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authkey", authKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    smsProviderUrl, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("SMS sent successfully to {}", to);
            } else {
                log.error("Failed to send SMS to {}. Response: {}", to, response.getBody());
            }

        } catch (Exception e) {
            log.error("Error sending SMS to {}: {}", to, e.getMessage());
            // Don't throw exception - SMS failure shouldn't break the main flow
        }
    }


    public void sendOTP(String mobile, String otp) {
        String message = String.format(
                "Your YaVij Express OTP is %s. Valid for 5 minutes. Do not share with anyone.",
                otp
        );
        sendSMS(mobile, message);
    }


    public void sendEmergencySMS(String to, String emergencyType, String location, String tripDetails) {
        String message = String.format(
                "EMERGENCY ALERT - %s\nLocation: %s\nTrip: %s\nTime: %s\nImmediate action required!",
                emergencyType,
                location,
                tripDetails,
                java.time.LocalDateTime.now()
        );
        sendSMS(to, message);
    }

    // Mock SMS for testing
    public void sendMockSMS(String to, String message) {
        log.info("[MOCK SMS] To: {}, Message: {}", to, message);
        // In production, this would be replaced with actual SMS provider
    }
}