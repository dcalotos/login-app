package com.loginapp.repository;

import com.loginapp.entity.EmailVerificationToken;
import com.loginapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    
    Optional<EmailVerificationToken> findByToken(String token);
    
    Optional<EmailVerificationToken> findByUserAndUsedFalseAndExpiryDateAfter(User user, Instant now);
    
    void deleteByUser(User user);
    
    @Modifying
    @Query("DELETE FROM EmailVerificationToken t WHERE t.expiryDate < :now")
    void deleteExpiredTokens(Instant now);
}
