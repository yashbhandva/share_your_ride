package com.yavijexpress.utils;

import com.yavijexpress.entity.Booking;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailServiceImpl  {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public EmailServiceImpl(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String to, String name, String otp) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("otp", otp);
            context.setVariable("supportEmail", "support@yavijexpress.com");

            String htmlContent = templateEngine.process("email/verification", context);

            sendEmail(to, "Verify Your Email - YaVij Express", htmlContent);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }

    @Async
    public void sendOTPEmail(String to, String name, String otp) {
        try {
            String subject = "Your OTP Code - YaVij Express";
            String body = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Hello %s,</h2>
                    <p>Your OTP for YaVij Express is: <strong>%s</strong></p>
                    <p>This OTP is valid for 5 minutes.</p>
                    <hr>
                    <p><small>If you didn't request this, please ignore this email.</small></p>
                </body>
                </html>
                """, name, otp);

            sendEmail(to, subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            String subject = "Welcome to YaVij Express!";
            String body = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Welcome %s! 🎉</h2>
                    <p>Thank you for joining YaVij Express - India's leading ride-sharing platform.</p>
                    <p>Start your journey with us:</p>
                    <ul>
                        <li>✓ Share rides and save money</li>
                        <li>✓ Travel safely with verified users</li>
                        <li>✓ Earn money by offering rides</li>
                        <li>✓ 24/7 customer support</li>
                    </ul>
                    <p><a href="%s" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Riding</a></p>
                </body>
                </html>
                """, name, frontendUrl);

            sendEmail(to, subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    @Async
    public void sendBookingConfirmationEmail(String to, String name, Booking booking) {
        try {
            String subject = "Booking Confirmed - YaVij Express";
            String body = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Booking Confirmed! ✅</h2>
                    <p>Hello %s,</p>
                    <p>Your booking has been confirmed successfully.</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                        <h3>Booking Details:</h3>
                        <p><strong>Trip:</strong> %s → %s</p>
                        <p><strong>Date & Time:</strong> %s</p>
                        <p><strong>Seats:</strong> %d</p>
                        <p><strong>Amount:</strong> ₹%.2f</p>
                        <p><strong>Booking ID:</strong> %d</p>
                    </div>
                    <p>Have a safe journey! 🚗</p>
                </body>
                </html>
                """, name,
                    booking.getTrip().getFromLocation(),
                    booking.getTrip().getToLocation(),
                    booking.getTrip().getDepartureTime(),
                    booking.getSeatsBooked(),
                    booking.getTotalAmount(),
                    booking.getId());

            sendEmail(to, subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send booking confirmation email: " + e.getMessage());
        }
    }

    @Async
    public void sendEmergencyEmail(String to, String subject, String message) {
        try {
            String body = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif; color: #d32f2f;">
                    <h2>🚨 EMERGENCY ALERT</h2>
                    <p>%s</p>
                    <p><strong>Time:</strong> %s</p>
                    <hr>
                    <p><small>This is an automated emergency alert from YaVij Express.</small></p>
                </body>
                </html>
                """, message, java.time.LocalDateTime.now());

            sendEmail(to, "🚨 " + subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send emergency email: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String name, String resetLink) {
        try {
            String subject = "Password Reset - YaVij Express";
            String body = String.format("""
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Password Reset Request</h2>
                    <p>Hello %s,</p>
                    <p>We received a request to reset your password. Click the button below to reset:</p>
                    <p><a href="%s" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </body>
                </html>
                """, name, resetLink);

            sendEmail(to, subject, body);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }

    private void sendEmail(String to, String subject, String body) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail, "YaVij Express");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);

        mailSender.send(message);
    }
}