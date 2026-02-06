package com.loginapp.service;

import com.loginapp.entity.EmailVerificationToken;
import com.loginapp.entity.User;
import com.loginapp.exception.TokenRefreshException;
import com.loginapp.repository.EmailVerificationTokenRepository;
import com.loginapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailVerificationService {
    
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final AuditLogService auditLogService;
    
    @Value("${app.email-verification.token-expiration:86400000}") // 24 hours in milliseconds
    private Long tokenExpirationMs;
    
    /**
     * Create an email verification token and send verification email.
     */
    @Transactional
    public void createVerificationToken(User user) {
        // Delete any existing tokens for this user
        emailVerificationTokenRepository.deleteByUser(user);
        
        // Generate new token
        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusMillis(tokenExpirationMs);
        
        EmailVerificationToken verificationToken = new EmailVerificationToken(token, user, expiryDate);
        emailVerificationTokenRepository.save(verificationToken);
        
        // Send verification email
        sendVerificationEmail(user.getEmail(), token);
        
        // Log the action
        auditLogService.logAction(user, "EMAIL_VERIFICATION_SENT", 
                "Email verification token generated", null);
        
        log.info("Email verification token created for user: {}", user.getUsername());
    }
    
    /**
     * Verify email using token.
     */
    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new TokenRefreshException(token, "Invalid email verification token"));
        
        if (verificationToken.isUsed()) {
            throw new TokenRefreshException(token, "Email verification token has already been used");
        }
        
        if (verificationToken.isExpired()) {
            emailVerificationTokenRepository.delete(verificationToken);
            throw new TokenRefreshException(token, "Email verification token has expired");
        }
        
        User user = verificationToken.getUser();
        
        // Mark user as verified
        user.setVerified(true);
        userRepository.save(user);
        
        // Mark token as used
        verificationToken.setUsed(true);
        emailVerificationTokenRepository.save(verificationToken);
        
        // Log the action
        auditLogService.logAction(user, "EMAIL_VERIFIED", 
                "Email successfully verified", null);
        
        log.info("Email successfully verified for user: {}", user.getUsername());
    }
    
    /**
     * Resend verification email.
     */
    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        if (user.isVerified()) {
            throw new RuntimeException("Email is already verified");
        }
        
        createVerificationToken(user);
    }
    
    /**
     * Validate if a token is valid (not expired and not used).
     */
    public boolean validateToken(String token) {
        return emailVerificationTokenRepository.findByToken(token)
                .map(t -> !t.isUsed() && !t.isExpired())
                .orElse(false);
    }
    
    /**
     * Clean up expired tokens (can be scheduled).
     */
    @Transactional
    public void cleanupExpiredTokens() {
        emailVerificationTokenRepository.deleteExpiredTokens(Instant.now());
        log.info("Cleaned up expired email verification tokens");
    }
    
    /**
     * Send verification email to user.
     */
    private void sendVerificationEmail(String toEmail, String token) {
        // This will be implemented in EmailService
        emailService.sendVerificationEmail(toEmail, token);
    }
}
