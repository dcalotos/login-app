package com.loginapp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {
    
    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;
    
    @Value("${app.name:Login Application}")
    private String appName;
    
    /**
     * Send password reset email.
     * In production, integrate with a real email service like SendGrid, AWS SES, or SMTP.
     * For now, this logs the reset link.
     */
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        
        // TODO: Replace with actual email sending logic
        log.info("=================================================");
        log.info("PASSWORD RESET EMAIL");
        log.info("=================================================");
        log.info("To: {}", toEmail);
        log.info("Subject: Password Reset Request - {}", appName);
        log.info("");
        log.info("Hello,");
        log.info("");
        log.info("You have requested to reset your password.");
        log.info("Please click the link below to reset your password:");
        log.info("");
        log.info("Reset Link: {}", resetLink);
        log.info("");
        log.info("This link will expire in 1 hour.");
        log.info("");
        log.info("If you did not request this, please ignore this email.");
        log.info("");
        log.info("Best regards,");
        log.info("{} Team", appName);
        log.info("=================================================");
        
        // In production, use an email service:
        /*
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom("noreply@yourapp.com");
        helper.setTo(toEmail);
        helper.setSubject("Password Reset Request - " + appName);
        helper.setText(buildEmailContent(resetLink), true);
        
        mailSender.send(message);
        */
    }
    
    /**
     * Send email verification email.
     */
    public void sendVerificationEmail(String toEmail, String verificationToken) {
        String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;
        
        // TODO: Replace with actual email sending logic
        log.info("=================================================");
        log.info("EMAIL VERIFICATION");
        log.info("=================================================");
        log.info("To: {}", toEmail);
        log.info("Subject: Verify Your Email - {}", appName);
        log.info("");
        log.info("Hello,");
        log.info("");
        log.info("Thank you for registering!");
        log.info("Please click the link below to verify your email address:");
        log.info("");
        log.info("Verification Link: {}", verificationLink);
        log.info("");
        log.info("This link will expire in 24 hours.");
        log.info("");
        log.info("If you did not create an account, please ignore this email.");
        log.info("");
        log.info("Best regards,");
        log.info("{} Team", appName);
        log.info("=================================================");
    }
    
    /**
     * Build HTML email content for password reset.
     */
    private String buildEmailContent(String resetLink) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; }
                    .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                             color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>%s</h1>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>You have requested to reset your password. Click the button below to reset it:</p>
                        <p style="text-align: center;">
                            <a href="%s" class="button">Reset Password</a>
                        </p>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background-color: #eee; padding: 10px;">%s</p>
                        <p><strong>This link will expire in 1 hour.</strong></p>
                        <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2026 %s. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """, appName, resetLink, resetLink, appName);
    }
}
