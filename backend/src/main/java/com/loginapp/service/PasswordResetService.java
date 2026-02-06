package com.loginapp.service;

import com.loginapp.entity.PasswordResetToken;
import com.loginapp.entity.User;
import com.loginapp.exception.TokenRefreshException;
import com.loginapp.repository.PasswordResetTokenRepository;
import com.loginapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {
    
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    
    @Value("${app.password-reset.token-expiration:3600000}") // 1 hour in milliseconds
    private Long tokenExpirationMs;
    
    /**
     * Create a password reset token and send email.
     */
    @Transactional
    public void createPasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        // Delete any existing tokens for this user
        passwordResetTokenRepository.deleteByUser(user);
        
        // Generate new token
        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plusMillis(tokenExpirationMs);
        
        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiryDate);
        passwordResetTokenRepository.save(resetToken);
        
        // Send email with reset link
        emailService.sendPasswordResetEmail(email, token);
        
        // Log the action
        auditLogService.log(user.getId(), "PASSWORD_RESET_REQUESTED", 
                "Password reset token generated", null);
        
        log.info("Password reset token created for user: {}", user.getUsername());
    }
    
    /**
     * Validate and use a password reset token to change password.
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new TokenRefreshException("Invalid password reset token"));
        
        if (resetToken.isUsed()) {
            throw new TokenRefreshException("Password reset token has already been used");
        }
        
        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new TokenRefreshException("Password reset token has expired");
        }
        
        User user = resetToken.getUser();
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
        
        // Log the action
        auditLogService.log(user.getId(), "PASSWORD_RESET_SUCCESS", 
                "Password successfully reset", null);
        
        log.info("Password successfully reset for user: {}", user.getUsername());
    }
    
    /**
     * Validate if a token is valid (not expired and not used).
     */
    public boolean validateToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .map(t -> !t.isUsed() && !t.isExpired())
                .orElse(false);
    }
    
    /**
     * Clean up expired tokens (can be scheduled).
     */
    @Transactional
    public void cleanupExpiredTokens() {
        passwordResetTokenRepository.deleteExpiredTokens(Instant.now());
        log.info("Cleaned up expired password reset tokens");
    }
}
