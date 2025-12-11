package com.yavijexpress.utils;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OTPService {

    private final Map<String, OTPData> otpStorage = new ConcurrentHashMap<>();

    public String generateOTP(String email) {
        String otp = String.format("%06d", (int) (Math.random() * 1000000));
        otpStorage.put(email, new OTPData(otp, System.currentTimeMillis()));
        return otp;
    }

    public boolean validateOTP(String email, String otp) {
        OTPData otpData = otpStorage.get(email);
        if (otpData == null) {
            return false;
        }

        long currentTime = System.currentTimeMillis();
        long otpAge = currentTime - otpData.getTimestamp();

        // OTP valid for 5 minutes
        if (otpAge > TimeUnit.MINUTES.toMillis(5)) {
            otpStorage.remove(email);
            return false;
        }

        if (otpData.getOtp().equals(otp)) {
            otpStorage.remove(email);
            return true;
        }

        return false;
    }

    public void clearOTP(String email) {
        otpStorage.remove(email);
    }

    private static class OTPData {
        private final String otp;
        private final long timestamp;

        public OTPData(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }

        public String getOtp() { return otp; }
        public long getTimestamp() { return timestamp; }
    }
}