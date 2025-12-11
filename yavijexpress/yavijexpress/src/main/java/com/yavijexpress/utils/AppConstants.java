// FILE: AppConstants.java
package com.yavijexpress.utils;

public class AppConstants {

    // JWT Constants
    public static final long JWT_EXPIRATION = 86400000; // 24 hours
    public static final long REFRESH_TOKEN_EXPIRATION = 604800000; // 7 days

    // OTP Constants
    public static final int OTP_LENGTH = 6;
    public static final int OTP_EXPIRY_MINUTES = 5;

    // Pagination
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIR = "asc";

    // File Upload
    public static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    public static final String[] ALLOWED_FILE_TYPES = {"image/jpeg", "image/png", "image/jpg", "application/pdf"};

    // Payment
    public static final String CURRENCY = "INR";
    public static final double PLATFORM_COMMISSION = 0.10; // 10%

    // Emergency
    public static final String SOS_MESSAGE_TEMPLATE = "EMERGENCY! User %s has triggered SOS at location: %f, %f. Trip ID: %d";
    public static final String[] EMERGENCY_NUMBERS = {"100", "102", "108"};

    // Validation Regex
    public static final String MOBILE_REGEX = "^[6-9]\\d{9}$";
    public static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";
    public static final String AADHAAR_REGEX = "^[2-9]{1}[0-9]{11}$";
    public static final String LICENSE_REGEX = "^[A-Z]{2}[0-9]{2}[0-9]{11}$";
}